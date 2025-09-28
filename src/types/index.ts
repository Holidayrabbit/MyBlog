// 主题类型
export type Theme = 'light' | 'dark';

// 语言类型
export type Language = 'zh' | 'en';

// 文章类型
export interface Article {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  filename: string;
  dateSort: string;
}

// 项目类型
export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  github: string;
  tags: string[];
}

// 论文类型
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
}

// 统计数据类型
export interface Stats {
  articles: number;
  projects: number;
  papers: number;
  tags: number;
}
