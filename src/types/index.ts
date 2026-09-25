// 主题类型
export type Theme = 'light' | 'dark';

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
