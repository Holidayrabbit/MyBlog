# 🎨 MyBlog - 极简个人博客系统

> 一个基于React+TypeScript的现代化极简个人博客系统，灵感来源于极简主义设计理念

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF.svg)](https://vitejs.dev/)

## ✨ 功能特性

### 🎨 设计理念
- **极简主义** - 纯黑白配色，专注内容表达
- **响应式设计** - 完美适配桌面端、平板和移动端
- **现代化UI** - 简洁优雅的界面设计

### 💫 核心功能
- 🌓 **主题切换** - 明暗主题无缝切换
- 🌍 **多语言支持** - 中英文国际化切换
- 📝 **Markdown渲染** - 完整的文章渲染系统
- 🤖 **自动化管理** - 智能文章索引生成
- 🏷️ **智能标签** - 自动提取文章标签和摘要
- 📱 **移动优先** - 原生移动端体验

### 🚀 开发特性
- ⚡ **快速构建** - Vite驱动的极速开发体验
- 🔧 **TypeScript** - 完整的类型安全
- 📦 **组件化** - 高度可复用的组件架构
- 🌐 **一键部署** - GitHub Actions自动化部署

## 页面结构

- **首页** - 博客介绍、统计信息和快速导航
- **文章** - Markdown文章列表和详情页
- **学术** - 研究兴趣、论文发表和学术活动
- **项目** - 开源项目展示
- **简历** - 个人简历展示和下载

## 🛠️ 技术栈

### 核心技术
- **前端框架**: React 19.1 + TypeScript 5.8
- **构建工具**: Vite 7.1
- **路由管理**: React Router Dom 7.9

### UI 与样式
- **样式方案**: 原生CSS + CSS Variables
- **图标库**: Lucide React 0.544
- **响应式**: Flexbox + CSS Grid

### 功能扩展
- **国际化**: React i18next 16.0
- **Markdown**: React Markdown + Remark GFM
- **PDF预览**: React PDF + PDF.js
- **主题管理**: Context API + localStorage

### 开发工具
- **代码检查**: ESLint 9.36 + TypeScript ESLint
- **构建优化**: Vite插件生态
- **部署**: GitHub Actions + GitHub Pages

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 1️⃣ 克隆项目

```bash
# 使用HTTPS
git clone https://github.com/YOUR_USERNAME/MyBlog.git

# 或使用SSH
git clone git@github.com:YOUR_USERNAME/MyBlog.git

cd MyBlog
```

### 2️⃣ 安装依赖

```bash
# 使用npm（推荐）
npm install

# 或使用yarn
yarn install
```

### 3️⃣ 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看网站

### 4️⃣ 构建和预览

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 5️⃣ 添加你的内容

```bash
# 生成文章索引
npm run articles:generate

# 边开发边生成文章
npm run articles:watch
```

## 🌐 部署指南

### GitHub Pages（推荐）

```bash
# 1. 推送代码到GitHub
git init
git add .
git commit -m "🎉 Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main

# 2. 在GitHub仓库设置中启用Pages
# Settings > Pages > Source: "GitHub Actions"

# 3. 每次推送会自动部署
git add .
git commit -m "📝 Update content"
git push
```

访问地址：`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

**注意**：项目使用 HashRouter 进行路由管理，URL 格式为：
- 首页: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/#/`
- 文章: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/#/articles`
- 学术: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/#/academic`

### 其他部署方式

- **Vercel**: 连接GitHub仓库，自动部署
- **Netlify**: 拖拽`dist`文件夹即可部署
- **自定义服务器**: 上传`dist`目录到Web服务器

详细部署说明请查看：[部署指南](docs/DEPLOYMENT.md)

## ⚙️ 自定义配置

### 🙋‍♂️ 个人信息设置

```bash
# 1. 修改页面文本和个人信息
src/i18n/index.ts              # 国际化文本配置

# 2. 更新页面内容
src/pages/Home.tsx             # 首页个人介绍
src/pages/Academic.tsx         # 学术背景
src/pages/Projects.tsx         # 项目展示
src/pages/Resume.tsx          # 简历页面

# 3. 替换个人文件
public/pdfs/resume.pdf        # 替换为你的简历PDF
```

### 📝 内容管理

```bash
# 添加新文章
touch public/articles/my-new-post.md

# 自动生成文章索引
npm run articles:generate

# 实时预览
npm run articles:watch
```

📖 详细指南：[文章管理指南](docs/ARTICLES_GUIDE.md)

### 🎨 主题定制

```css
/* src/App.css */
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --border-color: #e5e5e5;
}

:root[data-theme="dark"] {
  --bg-primary: #000000;
  --text-primary: #ffffff;  
  --border-color: #333333;
}
```

### 🔧 高级配置

```typescript
// vite.config.ts - 构建配置
export default defineConfig({
  base: '/your-repo-name/',    // 部署路径
  build: {
    outDir: 'dist'             // 输出目录
  }
})
```

## 📁 项目结构

```
MyBlog/
├── 📂 public/                    # 静态资源
│   ├── articles/                # 📝 Markdown文章
│   ├── pdfs/                   # 📄 PDF文件
│   └── articles.json           # 🤖 自动生成的文章索引
│
├── 📂 src/                      # 源代码
│   ├── 📂 components/           # 🧩 可复用组件
│   │   ├── Header.tsx          # 🧭 顶部导航
│   │   ├── Footer.tsx          # 🦶 底部版权
│   │   ├── Layout.tsx          # 🏗️ 页面布局
│   │   └── PDFViewer.tsx       # 📊 PDF查看器
│   │
│   ├── 📂 pages/               # 📄 页面组件
│   │   ├── Home.tsx            # 🏠 首页
│   │   ├── Articles.tsx        # 📚 文章列表
│   │   ├── ArticleDetail.tsx   # 📖 文章详情
│   │   ├── Academic.tsx        # 🎓 学术页面
│   │   ├── Projects.tsx        # 💼 项目展示
│   │   └── Resume.tsx          # 📄 简历页面
│   │
│   ├── 📂 contexts/            # 🔄 React上下文
│   │   └── ThemeContext.tsx    # 🌓 主题管理
│   │
│   ├── 📂 hooks/               # 🪝 自定义Hooks
│   │   └── useArticles.ts      # 📝 文章数据Hook
│   │
│   ├── 📂 types/               # 📋 类型定义
│   │   └── index.ts            # 🏷️ 全局类型
│   │
│   ├── 📂 i18n/                # 🌍 国际化
│   │   └── index.ts            # 🗣️ 语言配置
│   │
│   └── 📂 utils/               # 🛠️ 工具函数
│       └── articles.ts         # 📝 文章处理工具
│
├── 📂 scripts/                 # 🤖 自动化脚本
│   └── generate-articles.js    # 📚 文章索引生成器
│
├── 📂 docs/                    # 📚 项目文档
│   ├── ARTICLES_GUIDE.md       # 📝 文章管理指南
│   └── DEPLOYMENT.md           # 🚀 部署指南
│
└── 📂 dist/                    # 🏗️ 构建输出（自动生成）
```

## 💡 设计理念

### 极简主义核心
- **🎨 纯净配色**: 严格的黑白配色方案，专注内容本身
- **📐 简洁布局**: 去繁就简，让信息层次清晰明了  
- **⚡ 流畅体验**: 快速响应，无复杂动画干扰
- **📱 设备友好**: 完美适配桌面、平板、手机

### 技术哲学
- **🔧 现代标准**: 采用最新Web标准和最佳实践
- **♿ 无障碍性**: 考虑不同用户的使用需求
- **🚀 性能优先**: 优化加载速度和运行效率
- **🔄 可维护性**: 代码结构清晰，易于扩展

## 🌏 浏览器支持

| 浏览器 | 版本要求 | 状态 |
|-------|---------|------|
| Chrome | >= 88 | ✅ 完全支持 |
| Firefox | >= 85 | ✅ 完全支持 |
| Safari | >= 14 | ✅ 完全支持 |
| Edge | >= 88 | ✅ 完全支持 |

## 📊 NPM脚本说明

| 命令 | 功能 | 说明 |
|------|------|------|
| `npm run dev` | 启动开发服务器 | 热重载，实时预览 |
| `npm run build` | 构建生产版本 | 优化代码，生成dist目录 |
| `npm run preview` | 预览构建结果 | 本地预览生产版本 |
| `npm run lint` | 代码检查 | ESLint检查代码规范 |
| `npm run type-check` | 类型检查 | TypeScript类型验证 |
| `npm run articles:generate` | 生成文章索引 | 扫描文章并更新索引 |
| `npm run articles:watch` | 监听文章变化 | 生成文章+启动开发服务器 |

## 🤝 参与贡献

我们欢迎各种形式的贡献！

### 🐛 报告问题
- 在[Issues页面](https://github.com/YOUR_USERNAME/MyBlog/issues)提交问题
- 清晰描述问题和复现步骤
- 提供运行环境信息

### 💡 功能建议
- 在Issues中标记为"enhancement"
- 详细说明功能需求和使用场景

### 🔧 代码贡献
```bash
# 1. Fork项目并克隆
git clone https://github.com/YOUR_USERNAME/MyBlog.git

# 2. 创建功能分支
git checkout -b feature/amazing-feature

# 3. 提交更改
git commit -m "✨ Add amazing feature"

# 4. 推送到分支
git push origin feature/amazing-feature

# 5. 创建Pull Request
```

### 📝 文档改进
- 改进README和文档
- 添加代码注释
- 更新使用指南

## 📄 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐**

Made with ❤️ by [ZhaoQie](https://github.com/YOUR_USERNAME)

</div>
