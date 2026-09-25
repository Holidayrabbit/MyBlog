# 部署指南

默认部署方式为 GitHub Pages：push 到 main 分支后，[deploy.yml](../.github/workflows/deploy.yml) 自动执行
`npm ci` → `articles:generate` → `npm run build` → 发布 `dist/`。

## GitHub Pages

1. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**（仅需设置一次）
2. 之后每次 push 到 main 自动构建部署，进度见仓库 Actions 标签页

注意事项：

- `vite.config.ts` 中 `base: '/MyBlog/'` 必须与仓库名一致，否则资源 404
- 线上地址格式：`https://<用户名>.github.io/<仓库名>/`
- 路由使用 HashRouter，文章链接形如 `/#/articles/<id>`

## 自定义域名

1. 在仓库根目录添加 `public/CNAME` 文件，内容为你的域名（如 `blog.example.com`）
2. DNS 添加 CNAME 记录指向 `<用户名>.github.io`
3. Settings → Pages → Custom domain 填入并勾选 Enforce HTTPS
4. 同时把 `vite.config.ts` 的 `base` 改为 `/`（自定义域名部署在根路径）

## 其他平台

- **Vercel / Netlify**：导入 GitHub 仓库，构建命令 `npm run build`，输出目录 `dist`，并将 `base` 改为 `/`
- **自有服务器**：构建后把 `dist/` 目录内容放到任意静态文件服务即可（同样需 `base: '/'` 重建）
