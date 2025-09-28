import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useArticles, useTags, useArticleStats } from '../hooks/useArticles';

const Articles: React.FC = () => {
  const { t } = useTranslation();
  const { articles, loading: articlesLoading, error: articlesError } = useArticles();
  const { tags, loading: tagsLoading } = useTags();
  const { stats, loading: statsLoading } = useArticleStats();

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('articlesTitle')}</h1>
        <p className="page-description">{t('articlesDesc')}</p>
      </div>

      <div className="articles-layout">
        <div className="articles-main">
          <div className="articles-list">
            {articlesLoading ? (
              <div className="loading">正在加载文章...</div>
            ) : articlesError ? (
              <div className="error">加载文章失败: {articlesError}</div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <article key={article.id} className="article-item">
                  <h2 className="article-title">
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </h2>
                  <p className="article-date">{article.date}</p>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-tags">
                    {article.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <Link to={`/articles/${article.id}`} className="read-more">
                    {t('readMore')} →
                  </Link>
                </article>
              ))
            ) : (
              <div className="no-articles">暂无文章</div>
            )}
          </div>
        </div>

        <aside className="articles-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">文章分类</h3>
            <div className="tags-cloud">
              {tagsLoading ? (
                <div className="loading-small">加载中...</div>
              ) : (
                tags.map((tag) => (
                  <span key={tag} className="tag clickable">{tag}</span>
                ))
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">文章统计</h3>
            <div className="stats">
              {statsLoading ? (
                <div className="loading-small">加载中...</div>
              ) : (
                <>
                  <div className="stat-item">
                    <span className="stat-icon">📝</span>
                    <span className="stat-label">{t('totalArticles')}：</span>
                    <span className="stat-value">{stats.totalArticles}篇</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🏷️</span>
                    <span className="stat-label">{t('totalTags')}：</span>
                    <span className="stat-value">{stats.totalTags}个</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📅</span>
                    <span className="stat-label">{t('lastUpdated')}：</span>
                    <span className="stat-value">{stats.latestUpdate}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Articles;