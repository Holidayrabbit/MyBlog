import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useArticle } from '../hooks/useArticles';
import { fetchArticleContent } from '../utils/articles';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { article, loading: articleLoading, error: articleError } = useArticle(id || '');
  const [content, setContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      if (!article?.filename) return;
      
      try {
        setContentLoading(true);
        setContentError(null);
        const data = await fetchArticleContent(article.filename);
        setContent(data);
      } catch (err) {
        setContentError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setContentLoading(false);
      }
    }

    loadContent();
  }, [article?.filename]);

  if (articleLoading) {
    return (
      <div className="container">
        <div className="loading">正在加载文章...</div>
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="container">
        <div className="article-not-found">
          <h1>文章未找到</h1>
          <p>{articleError || '文章不存在'}</p>
          <Link to="/articles" className="back-link">
            <ArrowLeft size={18} />
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <article className="article-detail">
        <header className="article-header">
          <Link to="/articles" className="back-link">
            <ArrowLeft size={18} />
            {t('back')}
          </Link>
          
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
            <div className="meta-item">
              <Tag size={16} />
              <div className="article-tags">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="article-content">
          {contentLoading ? (
            <div className="loading">正在加载内容...</div>
          ) : contentError ? (
            <div className="error">
              <p>加载内容失败: {contentError}</p>
              <p>文章摘要：{article.excerpt}</p>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
                h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
                h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
                p: ({ children }) => <p className="md-p">{children}</p>,
                code: ({ children, className }) => (
                  <code className={`md-code ${className || ''}`}>{children}</code>
                ),
                pre: ({ children }) => <pre className="md-pre">{children}</pre>,
                ul: ({ children }) => <ul className="md-ul">{children}</ul>,
                ol: ({ children }) => <ol className="md-ol">{children}</ol>,
                li: ({ children }) => <li className="md-li">{children}</li>,
                blockquote: ({ children }) => <blockquote className="md-blockquote">{children}</blockquote>,
                img: ({ src, alt }) => (
                  <img src={src} alt={alt} className="md-img" loading="lazy" />
                ),
                table: ({ children }) => <table className="md-table">{children}</table>,
                thead: ({ children }) => <thead className="md-thead">{children}</thead>,
                tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
                tr: ({ children }) => <tr className="md-tr">{children}</tr>,
                th: ({ children }) => <th className="md-th">{children}</th>,
                td: ({ children }) => <td className="md-td">{children}</td>,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;