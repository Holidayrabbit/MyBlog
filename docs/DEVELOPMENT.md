# 开发指南

## 环境与命令

环境要求：Node.js ≥ 18、npm ≥ 9。

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器（http://localhost:5173/MyBlog/） |
| `npm run build` | 类型检查 + 构建到 `dist/` |
| `npm run lint` | ESLint 检查 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run articles:generate` | 生成 `public/articles.json`（CI 部署时自动执行） |

提交前请保证 `lint`、`type-check`、`build` 三项全部通过。

## 技术栈

- **框架**：React 19 + TypeScript 5.8 + Vite 7
- **路由**：React Router 7（HashRouter，兼容 GitHub Pages 子路径）
- **样式**：原生 CSS + CSS Variables（明暗主题通过 `data-theme` 属性切换）
- **Markdown**：react-markdown + remark-gfm / remark-math / rehype-katex，代码高亮用 react-syntax-highlighter
- **国际化**：react-i18next，文案在 `src/i18n/index.ts`

## 架构

```
数据流：
public/articles/*.md ──(scripts/generate-articles.js)──> public/articles.json
                                                            │
                                     站点前台 ──fetch────────┤
                                     管理后台 ──GitHub API──> 仓库（保存即 commit → CI 部署）
```

- **站点前台**（读者看到的页面）只读：`src/utils/articles.ts` 拉取 `articles.json` 与文章原文，
  `src/hooks/useArticles.ts` 封装成 hooks，页面组件不直接发请求
- **管理后台**（`/#/admin`，仅博主）读写 GitHub 仓库：
  - `src/utils/githubApi.ts` — GitHub Contents API 封装（文章增删改、图片上传、登录与身份校验）
  - `src/pages/admin/` — Admin（容器）→ AdminLogin / AdminDashboard / ArticleEditor
  - 保存、删改、传图都直接 commit 到 main，由现有 CI 部署，后端为零
  - 可选的 OAuth 一键登录依赖 `cloudflare-worker/`（Client Secret 存在 Worker 里）

## 编码约定

- 函数组件 + hooks；类型统一放在 `src/types/index.ts` 或就近的模块内
- 组件文件用 PascalCase，工具 / hooks 用 camelCase；CSS 类名与所属组件同名前缀
- 样式使用现有 CSS Variables（`--bg-primary`、`--text-primary`、`--accent-orange` 等），
  新页面同时适配明暗两套主题，不要写死颜色
- 面向读者的界面文案走 i18n（`t('key')`）；管理后台为博主自用，直接写中文
- Git 提交信息用中文，格式 `feat: 添加xxx` / `docs: 更新xxx` / `chore: 删除xxx`
