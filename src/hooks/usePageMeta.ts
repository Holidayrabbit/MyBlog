import { useEffect } from 'react';

const SITE_TITLE = "ZhaoQie's Blog";

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content);
}

/**
 * 设置当前页的 <title> 与 meta description（同步更新 og:title / og:description）。
 * 传 undefined 则恢复站点默认标题。
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
    setMetaContent('meta[property="og:title"]', document.title);
    if (description) {
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:description"]', description);
    }
  }, [title, description]);
}
