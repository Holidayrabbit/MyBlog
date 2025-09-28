import { useState, useEffect } from 'react';
import type { Article } from '../types';
import { 
  fetchArticles, 
  fetchArticleById, 
  fetchLatestArticles, 
  fetchAllTags,
  fetchArticleStats 
} from '../utils/articles';

/**
 * 获取所有文章的hook
 */
export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticles();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return { articles, loading, error };
}

/**
 * 获取单篇文章的hook
 */
export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  return { article, loading, error };
}

/**
 * 获取最新文章的hook
 */
export function useLatestArticles(limit: number = 2) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatestArticles() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLatestArticles(limit);
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load latest articles');
      } finally {
        setLoading(false);
      }
    }

    loadLatestArticles();
  }, [limit]);

  return { articles, loading, error };
}

/**
 * 获取所有标签的hook
 */
export function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTags() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllTags();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tags');
      } finally {
        setLoading(false);
      }
    }

    loadTags();
  }, []);

  return { tags, loading, error };
}

/**
 * 获取文章统计信息的hook
 */
export function useArticleStats() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalTags: 0,
    latestUpdate: '',
    latestUpdateSort: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticleStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article stats');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return { stats, loading, error };
}
