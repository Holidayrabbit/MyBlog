import type { Article } from '../types';

/**
 * 获取所有文章数据
 */
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/articles.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

/**
 * 根据ID获取单篇文章
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    const articles = await fetchArticles();
    return articles.find(article => article.id === id) || null;
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}

/**
 * 处理markdown内容：移除frontmatter和重复的h1标题
 */
function processMarkdownContent(content: string): string {
  // 移除frontmatter（如果存在）
  let processedContent = content;
  
  // 检查是否有frontmatter
  if (processedContent.startsWith('---')) {
    const frontmatterEnd = processedContent.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      // 移除frontmatter部分（包括分隔符和空行）
      processedContent = processedContent.substring(frontmatterEnd + 3).replace(/^\s*\n/, '');
    }
  }
  
  // 移除第一个h1标题（避免与页面标题重复）
  // 匹配行首的 # 标题
  processedContent = processedContent.replace(/^#\s+.+$/m, '');
  
  // 清理开头的空行
  processedContent = processedContent.replace(/^\s*\n+/, '');
  
  return processedContent;
}

/**
 * 获取文章内容（markdown）
 */
export async function fetchArticleContent(filename: string): Promise<string> {
  try {
    const response = await fetch(`/articles/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawContent = await response.text();
    
    // 处理内容：移除frontmatter和重复标题
    return processMarkdownContent(rawContent);
  } catch (error) {
    console.error('Failed to fetch article content:', error);
    return '';
  }
}

/**
 * 获取最新的N篇文章
 */
export async function fetchLatestArticles(limit: number = 2): Promise<Article[]> {
  try {
    const articles = await fetchArticles();
    return articles.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch latest articles:', error);
    return [];
  }
}

/**
 * 根据标签过滤文章
 */
export async function fetchArticlesByTag(tag: string): Promise<Article[]> {
  try {
    const articles = await fetchArticles();
    return articles.filter(article => article.tags.includes(tag));
  } catch (error) {
    console.error('Failed to fetch articles by tag:', error);
    return [];
  }
}

/**
 * 获取所有标签
 */
export async function fetchAllTags(): Promise<string[]> {
  try {
    const articles = await fetchArticles();
    const allTags = articles.flatMap(article => article.tags);
    return Array.from(new Set(allTags)).sort();
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

/**
 * 搜索文章
 */
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const articles = await fetchArticles();
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Failed to search articles:', error);
    return [];
  }
}

/**
 * 获取文章统计信息
 */
export async function fetchArticleStats() {
  try {
    const articles = await fetchArticles();
    const allTags = await fetchAllTags();
    
    return {
      totalArticles: articles.length,
      totalTags: allTags.length,
      latestUpdate: articles[0]?.date || '',
      latestUpdateSort: articles[0]?.dateSort || ''
    };
  } catch (error) {
    console.error('Failed to fetch article stats:', error);
    return {
      totalArticles: 0,
      totalTags: 0,
      latestUpdate: '',
      latestUpdateSort: ''
    };
  }
}
