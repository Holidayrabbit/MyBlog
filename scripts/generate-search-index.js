#!/usr/bin/env node
// 生成站内搜索全文索引（public/search-index.json），在构建期运行。
// 把每篇文章的正文转成纯文本后与元数据一起打包，前端用 MiniSearch 检索。

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * markdown 转纯文本：保留文字与代码内容，去掉语法标记，压缩空白
 */
function toPlainText(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/, '') // frontmatter
    .replace(/```(\w*)\n?/g, '') // 代码围栏标记（保留代码内容）
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接取文字、图片取 alt
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // 标题标记
    .replace(/`([^`]*)`/g, '$1') // 行内代码
    .replace(/(\*\*|__|\*|_|~~)/g, '') // 粗体/斜体/删除线
    .replace(/^>\s?/gm, '') // 引用
    .replace(/^\s*[-*+]\s+/gm, '') // 列表标记
    .replace(/\|/g, ' ') // 表格分隔线
    .replace(/<[^>]+>/g, ' ') // HTML 标签
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSearchIndex() {
  const articlesPath = path.join(rootDir, 'public', 'articles.json');
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ 未找到 articles.json，请先运行 npm run articles:generate');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

  const docs = articles.map((article) => {
    const file = path.join(rootDir, 'public', 'articles', article.filename);
    const content = fs.existsSync(file) ? toPlainText(fs.readFileSync(file, 'utf-8')) : '';
    return {
      id: article.id,
      title: article.title,
      tags: article.tags,
      date: article.date,
      excerpt: article.excerpt,
      content,
    };
  });

  const outputFile = path.join(rootDir, 'public', 'search-index.json');
  fs.writeFileSync(outputFile, JSON.stringify(docs), 'utf-8');
  const sizeKb = Math.round(fs.statSync(outputFile).size / 1024);
  console.log(`✅ 搜索索引已生成: ${outputFile}（${docs.length} 篇，${sizeKb}KB）`);
}

generateSearchIndex();
