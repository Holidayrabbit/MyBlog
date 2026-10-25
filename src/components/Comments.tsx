import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GISCUS_CONFIG, isGiscusConfigured } from '../config/comments';

const GISCUS_LANG: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en',
};

/**
 * giscus 评论区。父组件用 key={文章 id} 挂载，切换文章时自动重建。
 * 未完成 giscus 配置时静默隐藏。
 */
const Comments: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isGiscusConfigured() || !containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    script.setAttribute('data-strict', GISCUS_CONFIG.strict ? '1' : '0');
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', GISCUS_LANG[i18n.language] || 'zh-CN');
    if (GISCUS_CONFIG.lazyLoad) {
      script.setAttribute('data-loading', 'lazy');
    }

    const container = containerRef.current;
    container.innerHTML = '';
    container.appendChild(script);

    const observer = new MutationObserver(() => {
      iframeRef.current = container.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      iframeRef.current = null;
      container.innerHTML = '';
    };
    // 主题/语言变化由下方的 postMessage 同步，无需重建 iframe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 主题或语言切换时，向 giscus iframe 发配置更新（官方推荐方式）
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !isGiscusConfigured()) return;
    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme,
            lang: GISCUS_LANG[i18n.language] || 'zh-CN',
          },
        },
      },
      'https://giscus.app'
    );
  }, [theme, i18n.language]);

  if (!isGiscusConfigured()) return null;

  return (
    <section className="comments-section">
      <h2 className="comments-title">
        <MessageCircle size={20} />
        {t('comments')}
      </h2>
      <div ref={containerRef} className="comments-container" />
    </section>
  );
};

export default Comments;
