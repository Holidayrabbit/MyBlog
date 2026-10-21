#!/usr/bin/env node
// 从 articles.json 生成 sitemap.xml（public/sitemap.xml），在构建期运行

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://holidayrabbit.github.io/MyBlog';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap() {
  const articlesPath = path.join(rootDir, 'public', 'articles.json');
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ 未找到 articles.json，请先运行 npm run articles:generate');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

  // 站内固定页面（admin 后台不对外，不收录）
  const pages = ['', '#/articles', '#/academic', '#/projects', '#/resume'].map(
    (fragment) => `  <url>\n    <loc>${SITE_URL}/${fragment}</loc>\n  </url>`
  );

  const articleUrls = articles.map(
    (article) => `  <url>\n    <loc>${escapeXml(`${SITE_URL}/#/articles/${article.id}`)}</loc>\n    <lastmod>${article.dateSort}</lastmod>\n  </url>`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pages, ...articleUrls].join('\n')}
</urlset>
`;

  const outputFile = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(outputFile, sitemap, 'utf-8');
  console.log(`✅ Sitemap 已生成: ${outputFile}（${pages.length + articles.length} 个 URL）`);
}

generateSitemap();
