import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Academic from './pages/Academic';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import './i18n';
import './App.css';
import './components.css';
import './pages.css';
import './article.css';

// 站点部署在 /MyBlog/ 子路径下，BrowserRouter 需与 vite base 保持一致
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// 管理后台独立分包，仅作者访问
const Admin = lazy(() => import('./pages/admin/Admin'));

function App() {
  return (
    <ThemeProvider>
      <Router basename={ROUTER_BASE}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resume" element={<Resume />} />
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={
                    <div className="container">
                      <div className="loading">加载中...</div>
                    </div>
                  }
                >
                  <Admin />
                </Suspense>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;