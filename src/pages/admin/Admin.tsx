import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  GitHubError,
  clearToken,
  consumeOAuthError,
  getToken,
  loginWithToken,
} from '../../utils/githubApi';
import type { AdminArticle, GitHubUser } from '../../utils/githubApi';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ArticleEditor from './ArticleEditor';
import './admin.css';

interface AdminSession {
  token: string;
  user: GitHubUser;
}

/**
 * 文章管理后台（仅作者使用）
 * 通过 GitHub Contents API 直接读写仓库，保存即 commit，推送后由 GitHub Actions 自动部署
 */
const Admin: React.FC = () => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checkingStored, setCheckingStored] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  // null = 列表页；'new' = 新建；AdminArticle = 编辑已有文章
  const [editing, setEditing] = useState<AdminArticle | 'new' | null>(null);

  useEffect(() => {
    // OAuth 授权失败时 Worker 会带回错误信息（StrictMode 下初始化器会执行两次，
    // consumeOAuthError 有副作用，所以放在 effect 里消费）
    const oauthError = consumeOAuthError();
    if (oauthError) setAuthError(oauthError);
  }, []);

  useEffect(() => {
    const saved = getToken();
    if (!saved) {
      setCheckingStored(false);
      return;
    }
    // 本地已有 token（上次登录过），重新校验身份：不是本人或权限失效则清除并提示
    loginWithToken(saved)
      .then(user => setSession({ token: saved, user }))
      .catch(err => {
        clearToken();
        setAuthError(
          err instanceof GitHubError ? err.message : '登录状态已失效，请重新登录',
        );
      })
      .finally(() => setCheckingStored(false));
  }, []);

  const handleLogout = () => {
    clearToken();
    setSession(null);
    setEditing(null);
  };

  if (checkingStored) {
    return (
      <div className="admin">
        <div className="admin-loading">
          <Loader2 size={20} className="admin-spin" />
          正在检查登录状态...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin">
        <AdminLogin initialError={authError} />
      </div>
    );
  }

  return (
    <div className="admin">
      {editing === null ? (
        <AdminDashboard
          token={session.token}
          user={session.user}
          onEdit={article => setEditing(article)}
          onNew={() => setEditing('new')}
          onLogout={handleLogout}
        />
      ) : (
        <ArticleEditor
          key={editing === 'new' ? '__new__' : editing.filename}
          token={session.token}
          article={editing === 'new' ? null : editing}
          onDone={() => setEditing(null)}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default Admin;
