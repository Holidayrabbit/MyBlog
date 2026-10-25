#!/usr/bin/env node
// 构建后预渲染：用本机/CI 的 Chrome 加载构建产物里的真实页面，
// 把每个路由渲染成独立的静态 HTML 文件，供 GitHub Pages 直接返回。
//
// 产出：
//   dist/                      首页（含渲染后的内容）
//   dist/articles/<id>/        每篇文章一个 index.html
//   dist/{articles,academic,projects,resume}/  固定页面
//   dist/404.html              SPA 兜底（admin 等未预渲染路由由它加载应用）
//
// 说明：应用入口是 createRoot().render()（非 hydrate），浏览器加载预渲染
// 页面后 React 直接接管 #root，无 hydration 冲突；不执行 JS 的爬虫和
// 社交抓取器则拿到完整内容与逐页 OG 标签。

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const BASE_PATH = '/MyBlog';
const PORT = 4573;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (urlPath.startsWith(BASE_PATH)) urlPath = urlPath.slice(BASE_PATH.length) || '/';
    let filePath = path.join(distDir, path.normalize(urlPath).replace(/^([.][.][/\\])+/, ''));
    if (!filePath.startsWith(distDir)) filePath = path.join(distDir, 'index.html');
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

function resolveChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    '未找到 Chrome/Chromium。请安装 Chrome，或设置 CHROME_PATH 环境变量指向可执行文件。'
  );
}

function collectRoutes() {
  const articlesPath = path.join(distDir, 'articles.json');
  if (!fs.existsSync(articlesPath)) {
    throw new Error('未找到 dist/articles.json，请先运行 npm run site:generate');
  }
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  const routes = [
    { route: '/', file: 'index.html', expect: '#root' },
    { route: '/articles/', file: 'articles/index.html', expect: '#root' },
    ...articles.map((article) => ({
      route: `/articles/${article.id}/`,
      file: `articles/${article.id}/index.html`,
      expect: '.article-content',
    })),
    { route: '/academic/', file: 'academic/index.html', expect: '#root' },
    { route: '/projects/', file: 'projects/index.html', expect: '#root' },
    { route: '/resume/', file: 'resume/index.html', expect: '#root' },
  ];
  return routes;
}

async function main() {
  const { default: puppeteer } = await import('puppeteer-core');

  const routes = collectRoutes();

  // SPA 兜底页必须在首页被预渲染覆盖之前保存（纯外壳，不含首页内容）
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));

  const server = await startStaticServer();
  const browser = await puppeteer.launch({
    executablePath: resolveChrome(),
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  let failed = 0;
  try {
    const page = await browser.newPage();
    for (const { route, file, expect } of routes) {
      const target = `http://127.0.0.1:${PORT}${BASE_PATH}${route === '/' ? '/' : route}`;
      try {
        await page.goto(target, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.waitForSelector(expect, { timeout: 15000 });
        // 等待文章内容/标题这类 effect 渲染稳定
        await new Promise((r) => setTimeout(r, 500));
        const html = await page.content();
        const outPath = path.join(distDir, file);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html);
        console.log(`  ✓ ${route}`);
      } catch (error) {
        failed += 1;
        console.error(`  ✗ ${route}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failed > 0) {
    throw new Error(`预渲染失败 ${failed} 个路由`);
  }
  console.log(`预渲染完成：${routes.length} 个路由 + 404.html 兜底`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
