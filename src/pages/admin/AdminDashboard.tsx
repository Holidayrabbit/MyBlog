import React, { useCallback, useEffect, useState } from 'react';
import {
  FileText,
  ExternalLink,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  deleteAdminArticle,
  getLatestDeploy,
  listAdminArticles,
} from '../../utils/githubApi';
import type { AdminArticle, DeployRun, GitHubUser } from '../../utils/githubApi';
import { GitHubError } from '../../utils/githubApi';

interface AdminDashboardProps {
  token: string;
  user: GitHubUser;
  onEdit: (article: AdminArticle) => void;
  onNew: () => void;
  onLogout: () => void;
}

function DeployChip({ run }: { run: DeployRun | null }) {
  if (!run) return null;

  let label = '部署';
  let className = 'admin-deploy-chip';
  if (run.status === 'queued') {
    label = '排队中';
  } else if (run.status === 'in_progress') {
    label = '构建中...';
    className += ' admin-deploy-building';
  } else if (run.status === 'completed' && run.conclusion === 'success') {
    label = '已发布';
    className += ' admin-deploy-ok';
  } else if (run.status === 'completed' && run.conclusion) {
    label = '部署失败';
    className += ' admin-deploy-fail';
  }

  return (
    <a
      href={run.html_url}
      target="_blank"
      rel="noreferrer"
      className={className}
      title="查看 GitHub Actions 部署详情"
    >
      <span className="admin-deploy-dot" />
      {label}
    </a>
  );
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, user, onEdit, onNew, onLogout }) => {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deploy, setDeploy] = useState<DeployRun | null>(null);
  const [deploying, setDeploying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listAdminArticles(token);
      setArticles(list);
    } catch (err) {
      setError(err instanceof GitHubError ? err.message : '加载文章列表失败');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // 轮询部署状态：刚保存完文章时能直观看到"构建中 → 已发布"
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const run = await getLatestDeploy(token);
      if (!cancelled) {
        setDeploy(run);
        setDeploying(run?.status === 'queued' || run?.status === 'in_progress');
      }
    };
    poll();
    const timer = setInterval(poll, 25000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [token, deploying]);

  const handleDelete = async (article: AdminArticle) => {
    const title = article.frontmatter.title || article.filename;
    if (!window.confirm(`确定删除文章《${title}》吗？\n\n文章及其图片目录会被一起删除（一个 commit）并触发重新部署，可用 git 历史恢复。`)) {
      return;
    }
    setDeleting(article.filename);
    try {
      await deleteAdminArticle(token, article.filename, title);
      await load();
    } catch (err) {
      setError(err instanceof GitHubError ? err.message : '删除失败');
    } finally {
      setDeleting(null);
    }
  };

  const handlePreview = (article: AdminArticle) => {
    const id = article.filename.replace(/\.md$/, '');
    window.open(`${import.meta.env.BASE_URL}#/articles/${id}`, '_blank');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <h1 className="admin-title">文章管理</h1>
          <span className="admin-count">{articles.length} 篇</span>
        </div>
        <div className="admin-toolbar-right">
          <DeployChip run={deploy} />
          <button className="admin-btn" onClick={load} disabled={loading} title="刷新列表">
            <RefreshCw size={15} className={loading ? 'admin-spin' : ''} />
            刷新
          </button>
          <button className="admin-btn admin-btn-primary" onClick={onNew}>
            <Plus size={15} />
            新建文章
          </button>
          <div className="admin-user">
            {user.avatar_url && <img src={user.avatar_url} alt={user.login} className="admin-avatar" />}
            <span>{user.name || user.login}</span>
          </div>
          <button className="admin-btn admin-btn-icon" onClick={onLogout} title="退出登录">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error admin-error-banner">
          {error}
          <button className="admin-btn" onClick={load}>
            重试
          </button>
        </div>
      )}

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <Loader2 size={20} className="admin-spin" />
            正在从 GitHub 加载文章...
          </div>
        ) : articles.length === 0 ? (
          <div className="admin-empty">
            <FileText size={32} />
            <p>还没有文章，点击右上角"新建文章"开始写作</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>标题</th>
                <th className="admin-col-date">日期</th>
                <th className="admin-col-tags">标签</th>
                <th className="admin-col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.filename}>
                  <td>
                    <button className="admin-article-link" onClick={() => onEdit(article)} title={article.filename}>
                      <span className="admin-article-title">{article.frontmatter.title || article.filename}</span>
                      <span className="admin-article-file">{article.filename}</span>
                    </button>
                  </td>
                  <td className="admin-col-date admin-muted">{article.frontmatter.date || '—'}</td>
                  <td className="admin-col-tags">
                    <div className="admin-tag-list">
                      {(article.frontmatter.tags || []).slice(0, 4).map(tag => (
                        <span key={tag} className="admin-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="admin-col-actions">
                    <div className="admin-row-actions">
                      <button className="admin-btn admin-btn-icon" onClick={() => onEdit(article)} title="编辑">
                        <Pencil size={15} />
                      </button>
                      <button
                        className="admin-btn admin-btn-icon"
                        onClick={() => handlePreview(article)}
                        title="在站点中查看"
                      >
                        <ExternalLink size={15} />
                      </button>
                      <button
                        className="admin-btn admin-btn-icon admin-btn-danger"
                        onClick={() => handleDelete(article)}
                        disabled={deleting === article.filename}
                        title="删除"
                      >
                        {deleting === article.filename ? <Loader2 size={15} className="admin-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deploying && (
        <p className="admin-deploy-hint">有部署正在进行，完成后网站会自动更新（通常 1-2 分钟）。</p>
      )}
    </div>
  );
};

export default AdminDashboard;
