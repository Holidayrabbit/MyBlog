# 🚀 MyBlog 部署指南

> 多种部署方式，满足不同需求 - 从免费到专业部署方案

## 📋 部署方式对比

| 平台 | 费用 | 难度 | 特点 | 推荐场景 |
|------|------|------|------|----------|
| **GitHub Pages** | 免费 | ⭐ | 自动部署，集成度高 | 个人博客，开源项目 |
| **Vercel** | 免费/付费 | ⭐ | 性能优异，全球CDN | 高性能需求 |
| **Netlify** | 免费/付费 | ⭐⭐ | 功能丰富，表单处理 | 商业项目 |
| **自定义服务器** | 自定义 | ⭐⭐⭐ | 完全控制 | 企业级应用 |

## 🎯 GitHub Pages（推荐）

GitHub Pages是最推荐的免费部署方案，支持自动部署和自定义域名。

### 🎯 一键部署步骤

```bash
# 1️⃣ 准备代码仓库
git init
git add .
git commit -m "🎉 Initial commit"

# 2️⃣ 创建GitHub仓库并推送
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main

# 3️⃣ 启用GitHub Pages
# 在GitHub网站上: Settings > Pages > Source: "GitHub Actions"
```

🌐 **访问地址**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

### ⚙️ 配置详解

#### vite.config.ts 配置
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPO_NAME/',    // 🔑 关键：必须设置为仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

#### GitHub Actions工作流
项目已预配置`.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Generate articles
      run: npm run articles:generate
      
    - name: Build
      run: npm run build
      
    - name: Upload Pages artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./dist
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### 🌐 自定义域名配置

#### 步骤一：添加CNAME文件
```bash
# 在项目根目录创建CNAME文件
echo "blog.yourdomain.com" > public/CNAME
```

#### 步骤二：DNS配置
```text
# 在你的域名DNS设置中添加记录：
类型: CNAME
名称: blog (或 @ 用于根域名)
值: YOUR_USERNAME.github.io
```

#### 步骤三：GitHub设置
1. 仓库设置 > Pages
2. Custom domain: 输入你的域名
3. 勾选 "Enforce HTTPS"

⚠️ **注意**：自定义域名生效需要几分钟到几小时不等

## 🚀 Vercel 部署

Vercel提供优秀的性能和全球CDN，特别适合React应用。

### 自动部署（推荐）
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 选择"Import Git Repository"
4. 选择你的MyBlog仓库
5. 点击"Deploy"

```bash
# Vercel会自动检测并使用以下配置：
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 环境变量设置
```bash
# 在Vercel项目设置中添加：
VITE_BASE_URL=/           # 根路径部署
```

### 自定义构建脚本
```json
{
  "scripts": {
    "vercel-build": "npm run articles:generate && npm run build"
  }
}
```

## 🌈 Netlify 部署

Netlify功能强大，支持表单处理、无服务器函数等高级功能。

### 拖拽部署（最简单）
1. 运行 `npm run build` 构建项目
2. 访问 [netlify.com](https://netlify.com)
3. 将 `dist` 文件夹拖拽到部署区域

### Git集成部署（推荐）
1. 注册并登录Netlify
2. 点击"New site from Git"
3. 连接GitHub并选择仓库
4. 配置构建设置：

```bash
Build command: npm run articles:generate && npm run build
Publish directory: dist
```

### netlify.toml配置
```toml
[build]
  command = "npm run articles:generate && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🖥️ 自定义服务器部署

### Nginx配置
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/myblog/dist;
    index index.html;
    
    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Gzip压缩
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

### Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run articles:generate && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建和运行
docker build -t myblog .
docker run -p 80:80 myblog
```

## 🛠️ 开发环境配置

### 本地开发
```bash
# 完整开发环境设置
npm install                    # 安装依赖
npm run articles:generate     # 生成文章索引
npm run dev                   # 启动开发服务器（localhost:5173）

# 开发时常用命令
npm run articles:watch        # 监听文章变化并启动开发服务器
npm run type-check           # TypeScript类型检查
npm run lint                 # 代码规范检查
```

### 构建和预览
```bash
npm run build                # 构建生产版本
npm run preview             # 预览构建结果（localhost:4173）
```

### 环境变量配置
```bash
# .env.local（本地开发）
VITE_APP_TITLE=我的博客
VITE_APP_DESCRIPTION=专注技术分享的个人博客
VITE_BASE_URL=/

# .env.production（生产环境）
VITE_APP_TITLE=MyBlog
VITE_BASE_URL=/MyBlog/
```

## 🔧 故障排除指南

### 🚨 常见部署问题

| 问题 | 症状 | 解决方案 |
|------|------|----------|
| **404错误** | 页面无法访问 | 检查`vite.config.ts`中的`base`配置 |
| **路由失效** | 刷新页面404 | 配置服务器支持SPA路由 |
| **资源加载失败** | 样式/图片丢失 | 检查资源路径和base配置 |
| **构建失败** | CI/CD报错 | 检查依赖版本和Node.js版本 |

### 🔍 调试工具

```bash
# 详细构建信息
npm run build -- --mode development

# 分析包大小
npm install -g vite-bundle-analyzer
vite-bundle-analyzer

# 性能分析
npm run build && npm run preview
# 在浏览器开发者工具中查看Network和Performance
```

### ⚡ 部署优化

#### 构建优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'markdown': ['react-markdown', 'remark-gfm']
        }
      }
    }
  }
})
```

#### 图片优化
```bash
# 使用webp格式
npm install --save-dev vite-plugin-webp
```

#### 预加载关键资源
```html
<!-- index.html -->
<link rel="preload" href="/assets/main.css" as="style">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

## 📊 监控和维护

### 更新依赖
```bash
# 检查过期依赖
npm outdated

# 安全更新
npm audit fix

# 主版本更新
npm update
```

### 性能监控
- **Core Web Vitals**: 使用Google PageSpeed Insights
- **Bundle大小**: 监控构建产物大小变化
- **加载时间**: 定期测试不同网络条件下的加载速度

### 备份策略
```bash
# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backup_${DATE}.tar.gz" dist/
aws s3 cp "backup_${DATE}.tar.gz" s3://your-backup-bucket/
```

---

## 🎯 部署检查清单

部署前请确认以下项目：

### 基础配置
- [ ] `vite.config.ts`中的`base`路径正确
- [ ] 环境变量配置完整
- [ ] 构建命令包含文章生成步骤

### 内容准备
- [ ] 个人信息已更新
- [ ] 文章内容已添加
- [ ] 简历PDF已替换
- [ ] 图片资源已优化

### 技术检查  
- [ ] 本地构建成功
- [ ] 类型检查通过
- [ ] 代码规范检查通过
- [ ] 移动端适配正常

### 部署验证
- [ ] 部署流水线正常运行
- [ ] 网站可以正常访问
- [ ] 所有页面功能正常
- [ ] SEO信息正确显示

🎉 **恭喜！** 你的MyBlog现在已经成功部署上线了！
