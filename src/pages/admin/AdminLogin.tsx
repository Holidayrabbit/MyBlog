import React from 'react';
import { KeyRound, LogIn } from 'lucide-react';
import { startOAuthLogin } from '../../utils/githubApi';

interface AdminLoginProps {
  initialError?: string | null; // 上次登录失败的提示（如身份校验被拒绝）
}

const AdminLogin: React.FC<AdminLoginProps> = ({ initialError }) => {
  return (
    <div className="admin-login">
      <div className="admin-card admin-login-card">
        <div className="admin-login-icon">
          <KeyRound size={28} />
        </div>
        <h1 className="admin-login-title">文章管理</h1>
        <div className="admin-login-actions">
          {initialError && <div className="admin-error">{initialError}</div>}
          <button type="button" className="admin-btn admin-btn-primary admin-login-oauth" onClick={startOAuthLogin}>
            <LogIn size={16} />
            使用 GitHub 登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
