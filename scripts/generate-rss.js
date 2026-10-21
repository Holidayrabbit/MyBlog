#!/usr/bin/env node
// 从 articles.json 生成 RSS 2.0 订阅源（public/rss.xml），在构建期运行

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://holidayrabbit.github.io/MyBlog';
const SITE_TITLE = "ZhaoQie's Blog";
const SITE_DESCRIPTION = '分享 AI Agent、大模型与编程技术的实践与思考';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822Date(dateSort) {
  const date = new Date(dateSort);
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
}

function generateRss() {
  const articlesPath = path.join(rootDir, 'public', 'articles.json');
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ 未找到 articles.json，请先运行 npm run articles:generate');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  const lastBuildDate = new Date().toUTCString();

  const items = articles
    .map((article) => {
      const link = `${SITE_URL}/#/articles/${article.id}`;
      const categories = article.tags.map((tag) => `    <category>${escapeXml(tag)}</category>`).join('\n');
      return `  <item>
    <title>${escapeXml(article.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <pubDate>${toRfc822Date(article.dateSort)}</pubDate>
    <description>${escapeXml(article.excerpt)}</description>
${categories}
  </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  const outputFile = path.join(rootDir, 'public', 'rss.xml');
  fs.writeFileSync(outputFile, rss, 'utf-8');
  console.log(`✅ RSS 已生成: ${outputFile}（${articles.length} 篇文章）`);
}

generateRss();
