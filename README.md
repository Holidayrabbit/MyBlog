# MyBlog

基于 React 19 + TypeScript + Vite 的极简个人博客，部署在 GitHub Pages，无需服务器。

线上地址：https://holidayrabbit.github.io/MyBlog/

## 功能

- 文章：Markdown 渲染（GFM、代码高亮、KaTeX 公式）、标签、自动摘要
- 页面：首页 / 文章 / 学术 / 项目 / 简历，中英双语，明暗主题
- 管理后台：`/#/admin`，在浏览器里写文章、传图片、查看部署状态，GitHub 身份校验，仅博主本人可登录
- 发布：保存即 commit，push 到 main 后 GitHub Actions 自动构建部署

## 快速开始

环境要求：Node.js ≥ 18。

```bash
npm install
npm run articles:generate   # 生成文章索引
npm run dev                 # http://localhost:5173/MyBlog/
```

## 写文章

统一通过网页后台管理：访问 `/#/admin` 登录后即可新建、编辑、删除文章，上传图片并插入引用，左侧编辑、右侧实时预览。
登录支持两种方式，均会校验账号必须是仓库所有者：

- **GitHub 一键登录**（需先部署 OAuth 中转，见 [cloudflare-worker/README.md](cloudflare-worker/README.md)）
- **Token 登录**：创建仅授权本仓库的 Fine-grained Token（Contents: Read and write）

编辑内容自动存入浏览器草稿，误关页面可恢复。详见 [docs/ARTICLES_GUIDE.md](docs/ARTICLES_GUIDE.md)。

文章本质上是仓库里的 `public/articles/*.md` 文件，frontmatter 字段说明见 ARTICLES_GUIDE；索引 `articles.json` 在部署时自动生成，无需手动维护。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 构建到 `dist/` |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` / `npm run type-check` | ESLint / TypeScript 检查 |

## 部署

push 到 main 分支即自动部署（[.github/workflows/deploy.yml](.github/workflows/deploy.yml)）：
安装依赖 → 生成文章索引 → 构建 → 发布到 GitHub Pages。

注意 `vite.config.ts` 的 `base: '/MyBlog/'` 需与仓库名一致。自定义域名或其他平台见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 目录结构

```
MyBlog/
├── public/
│   ├── articles/          # Markdown 文章（<slug>.md）
│   ├── images/            # 文章图片（<slug>/）
│   └── articles.json      # 自动生成的文章索引（勿手改）
├── src/
│   ├── pages/             # 页面组件
│   │   └── admin/         # 管理后台（登录 / 列表 / 编辑器）
│   ├── components/        # 通用组件（Layout、Markdown 渲染、CodeBlock 等）
│   ├── hooks/             # useArticles、useTheme 等
│   ├── utils/
│   │   ├── articles.ts    # 站点文章加载
│   │   └── githubApi.ts   # 管理后台的 GitHub API（读写文章、图片、OAuth）
│   └── i18n/              # 中英文案
├── scripts/
│   └── generate-articles.js  # 文章索引生成脚本
├── cloudflare-worker/     # OAuth 登录中转（可选部署）
└── docs/                  # 详细文档
```

## 文档

- [文章管理指南](docs/ARTICLES_GUIDE.md) — 后台用法、frontmatter 字段、图片管理
- [部署指南](docs/DEPLOYMENT.md) — GitHub Pages、自定义域名、其他平台
- [开发指南](docs/DEVELOPMENT.md) — 架构说明、编码约定

## 许可证

MIT License
