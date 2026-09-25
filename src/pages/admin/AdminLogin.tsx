import React, { useState } from 'react';
import { KeyRound, Loader2, ChevronDown, LogIn } from 'lucide-react';
import {
  GitHubError,
  loginWithToken,
  oauthConfigured,
  startOAuthLogin,
  storeToken,
} from '../../utils/githubApi';
import type { GitHubUser } from '../../utils/githubApi';

interface AdminLoginProps {
  onLogin: (token: string, user: GitHubUser) => void;
  initialError?: string | null; // 上次登录/自动登录失败的提示（如身份校验被拒绝）
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, initialError }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError('请输入 GitHub Token');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithToken(trimmed);
      storeToken(trimmed);
      onLogin(trimmed, user);
    } catch (err) {
      setError(err instanceof GitHubError ? err.message : '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-card admin-login-card">
        <div className="admin-login-icon">
          <KeyRound size={28} />
        </div>
        <h1 className="admin-login-title">文章管理</h1>
        <p className="admin-login-subtitle">
          使用 GitHub Token 登录，系统会校验 Token 是否属于仓库所有者本人
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {oauthConfigured() && (
            <>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-login-oauth"
                onClick={startOAuthLogin}
              >
                <LogIn size={16} />
                使用 GitHub 登录
              </button>
              <div className="admin-login-divider">或使用 Token 手动登录</div>
            </>
          )}
          <input
            type="password"
            className="admin-input"
            placeholder="粘贴 GitHub Token（github_pat_... 或 ghp_...）"
            value={token}
            onChange={e => setToken(e.target.value)}
            autoComplete="off"
            autoFocus={!oauthConfigured()}
          />
          {error && <div className="admin-error">{error}</div>}
          <button
            type="submit"
            className={`admin-btn ${oauthConfigured() ? '' : 'admin-btn-primary'}`}
            disabled={loading}
          >
            {loading && <Loader2 size={16} className="admin-spin" />}
            {loading ? '正在验证...' : oauthConfigured() ? '用 Token 登录' : '登录'}
          </button>
        </form>

        <button type="button" className="admin-help-toggle" onClick={() => setShowHelp(v => !v)}>
          如何获取 Token？
          <ChevronDown size={16} className={showHelp ? 'admin-chevron-up' : ''} />
        </button>

        {showHelp && (
          <ol className="admin-help">
            <li>
              打开 GitHub → Settings → Developer settings →{' '}
              <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">
                Fine-grained tokens <span className="admin-ext">↗</span>
              </a>{' '}
              → Generate new token
            </li>
            <li>Repository access 选择 Only select repositories，并勾选 MyBlog</li>
            <li>
              Permissions 中将 Repository permissions → <strong>Contents</strong> 设为{' '}
              <strong>Read and write</strong>（Metadata 会自动附带只读）
            </li>
            <li>生成后复制 Token 粘贴到上方输入框。建议设置过期时间，到期前重新生成</li>
          </ol>
        )}

        <p className="admin-login-note">
          Token 只保存在本浏览器中，且仅发送给 GitHub 官方 API。
          若怀疑泄露，随时可在 GitHub 设置中撤销。
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
