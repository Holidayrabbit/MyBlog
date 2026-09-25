import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureOAuthResult } from './utils/githubApi'

// GitHub OAuth 回调处理必须在 React 渲染前执行（读取 URL 参数并清理地址栏）
captureOAuthResult()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
