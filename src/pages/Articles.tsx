import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import MiniSearch from 'minisearch';
import { useArticles, useTags, useArticleStats } from '../hooks/useArticles';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Article } from '../types';

interface SearchDoc {
  id: string;
  title: string;
  tags: string[];
  excerpt: string;
  content: string;
}

const Articles: React.FC = () => {
  const { t } = useTranslation();
  const { articles, loading: articlesLoading, error: articlesError } = useArticles();
  const { tags, loading: tagsLoading } = useTags();
  const { stats, loading: statsLoading } = useArticleStats();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<MiniSearch<SearchDoc> | null>(null);

  usePageMeta(t('articlesTitle'), t('articlesDesc'));

  // 输入关键词后才加载全文索引，不拖累列表首屏
  useEffect(() => {
    const keyword = query.trim();
    if (!keyword || index) return;
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}search-index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((docs: SearchDoc[]) => {
        if (cancelled) return;
        const ms = new MiniSearch<SearchDoc>({
          fields: ['title', 'tags', 'excerpt', 'content'],
        });
        ms.addAll(docs);
        setIndex(ms);
      })
      .catch((err) => console.error('Failed to load search index:', err));
    return () => {
      cancelled = true;
    };
  }, [query, index]);

  const visibleArticles = useMemo<Article[] | null>(() => {
    const keyword = query.trim();
    if (!keyword) return null;
    if (!index) return null;
    const hits = index.search(keyword, { prefix: true, fuzzy: 0.2 });
    const byId = new Map(articles.map((article) => [article.id, article]));
    return hits
      .map((hit) => byId.get(String(hit.id)))
      .filter((article): article is Article => Boolean(article));
  }, [query, index, articles]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('articlesTitle')}</h1>
        <p className="page-description">{t('articlesDesc')}</p>
      </div>

      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery('')}
            aria-label={t('clearSearch')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="articles-layout">
        <div className="articles-main">
          <div className="articles-list">
            {articlesLoading ? (
              <div className="loading">{t('loading')}</div>
            ) : articlesError ? (
              <div className="error">{articlesError}</div>
            ) : isSearching ? (
              visibleArticles === null ? (
                <div className="loading">{t('loadingSearchIndex')}</div>
              ) : visibleArticles.length > 0 ? (
                visibleArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="no-articles">{t('noSearchResults')}</div>
              )
            ) : articles.length > 0 ? (
              articles.map((article) => <ArticleCard key={article.id} article={article} />)
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
                  <span
                    key={tag}
                    className="tag clickable"
                    onClick={() => setQuery(query === tag ? '' : tag)}
                  >
                    {tag}
                  </span>
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

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { t } = useTranslation();
  return (
    <article className="article-item">
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
  );
};

export default Articles;
