import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLatestArticles } from '../hooks/useArticles';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { articles, loading, error } = useLatestArticles(2);

  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">{t('welcome')}</h1>
        <p className="hero-subtitle">{t('subtitle')}</p>
      </section>

      <section className="latest-articles">
        <h2 className="section-title">{t('latestArticles')}</h2>
        <div className="articles-grid">
          {loading ? (
            <div className="loading">正在加载最新文章...</div>
          ) : error ? (
            <div className="error">加载文章失败: {error}</div>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <article key={article.id} className="article-card">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-date">{article.date}</p>
                <p className="article-excerpt">{article.excerpt}</p>
                <Link to={`/articles/${article.id}`} className="read-more">
                  {t('readMore')} →
                </Link>
              </article>
            ))
          ) : (
            <div className="no-articles">暂无文章</div>
          )}
        </div>
      </section>

      <section className="site-navigation">
        <h2 className="section-title">{t('siteNavigation')}</h2>
        <div className="nav-grid">
          <Link to="/articles" className="nav-card">
            <h3 className="nav-card-title">{t('technicalArticles')}</h3>
            <p className="nav-card-desc">{t('technicalArticlesDesc')}</p>
            <span className="nav-card-link">{t('readMore')} →</span>
          </Link>
          
          <Link to="/academic" className="nav-card">
            <h3 className="nav-card-title">{t('academicResearch')}</h3>
            <p className="nav-card-desc">{t('academicResearchDesc')}</p>
            <span className="nav-card-link">{t('readMore')} →</span>
          </Link>
          
          <Link to="/projects" className="nav-card">
            <h3 className="nav-card-title">{t('openSourceProjects')}</h3>
            <p className="nav-card-desc">{t('openSourceProjectsDesc')}</p>
            <span className="nav-card-link">{t('readMore')} →</span>
          </Link>
          
          <Link to="/resume" className="nav-card">
            <h3 className="nav-card-title">{t('personalResume')}</h3>
            <p className="nav-card-desc">{t('personalResumeDesc')}</p>
            <span className="nav-card-link">{t('readMore')} →</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;