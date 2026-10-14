import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLatestArticles } from '../hooks/useArticles';
import { navigationGroups, type Language } from '../data/navigation';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang: Language = i18n.language.startsWith('zh') ? 'zh' : 'en';
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
        {navigationGroups.map((group) => (
          <div key={group.key} className="nav-group">
            <h3 className="nav-group-title">{group.name[lang]}</h3>
            <div className="nav-grid">
              {group.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-card"
                >
                  <h3 className="nav-card-title">
                    <span className="nav-card-icon">{link.icon}</span>
                    {link.name}
                  </h3>
                  <p className="nav-card-desc">{link.desc[lang]}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;