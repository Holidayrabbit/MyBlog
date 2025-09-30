# 📷 图片使用指南

> 在 MyBlog 文章中插入和管理图片的完整指南

## 🎯 概述

MyBlog 支持多种图片插入方式，你可以根据需求选择最适合的方案。

## ⚠️ 重要提示：关于 base 路径

**本项目配置了 `base: '/MyBlog/'`，用于 GitHub Pages 部署。**

这意味着：
- ✅ **在线图床图片**：直接使用完整 URL，不受影响
  ```markdown
  ![图片](https://example.com/image.png)
  ```

- ✅ **本地图片**：必须加上 `/MyBlog/` 前缀
  ```markdown
  ![图片](/MyBlog/images/screenshot.png)
  ```

- ❌ **常见错误**：忘记加 `/MyBlog/` 前缀会导致 404
  ```markdown
  ![图片](/images/screenshot.png)  # ❌ 错误：缺少 base 路径
  ```

**记住：所有本地图片路径 = `/MyBlog/` + `public/` 后面的路径**

## 🌐 方案一：在线图床（推荐）

### ✅ 优点
- ✨ 无需本地存储，节省仓库空间
- 🚀 CDN加速，加载速度快
- 🔄 易于管理和更新
- 📦 不影响项目构建大小

### 📝 使用方法

#### 1. GitHub 作为图床（免费）

```markdown
![图片描述](https://raw.githubusercontent.com/用户名/仓库名/分支名/路径/图片.png)
```

**示例：**
```markdown
![Logo](https://raw.githubusercontent.com/Holidayrabbit/Imagehosting/main/BlogImg/logo.png)
```

**⚠️ 注意事项：**
- ❌ 不要使用 `github.com/用户名/仓库/blob/...` 格式（这是网页预览链接）
- ✅ 必须使用 `raw.githubusercontent.com` 格式（这是直接文件链接）
- 🔒 确保仓库是公开的，否则图片无法显示

**获取正确链接的方法：**
1. 在 GitHub 仓库中打开图片
2. 点击 "Raw" 按钮
3. 复制浏览器地址栏的 URL

#### 2. 专业图床服务

##### 🌍 国际图床

**Imgur** - 老牌图床，稳定可靠
- 网址: https://imgur.com
- 特点: 无需注册、支持大文件、永久存储
```markdown
![描述](https://i.imgur.com/图片ID.png)
```

**ImgBB** - 简单易用
- 网址: https://imgbb.com
- 特点: 简洁界面、免费无限存储
```markdown
![描述](https://i.ibb.co/图片ID/name.png)
```

##### 🇨🇳 国内图床（访问更快）

**SM.MS** - 中文友好
- 网址: https://sm.ms
- 特点: 中文界面、稳定快速、支持API
```markdown
![描述](https://s2.loli.net/图片路径.png)
```

**路过图床** - 国内优选
- 网址: https://imgse.com
- 特点: 国内CDN、速度快、免费
```markdown
![描述](https://图片链接)
```

**聚合图床** - 多图床管理
- 网址: https://www.superbed.cn
- 特点: 支持多个图床、统一管理
```markdown
![描述](https://图片链接)
```

#### 3. 云存储服务

**阿里云 OSS**
```markdown
![描述](https://你的域名.oss-cn-beijing.aliyuncs.com/路径/图片.png)
```

**腾讯云 COS**
```markdown
![描述](https://你的域名.cos.ap-beijing.myqcloud.com/路径/图片.png)
```

**七牛云**
```markdown
![描述](https://你的域名.qiniucdn.com/路径/图片.png)
```

## 📁 方案二：本地存储

### ✅ 优点
- 🔒 完全控制，不依赖第三方
- 🚫 无需担心图床失效
- 📦 图片跟随项目一起部署

### ⚠️ 缺点
- 📈 增加仓库体积
- 🐌 可能影响加载速度（无CDN）
- 🔄 Git历史会变大

### 📝 使用方法

#### 1. 创建图片目录

```bash
# 在 public 目录下创建 images 文件夹
mkdir -p public/images

# 或者按文章组织（推荐）
mkdir -p public/articles/images
```

#### 2. 添加图片文件

```bash
# 复制图片到目录
cp /path/to/image.png public/images/

# 或者直接拖拽图片到文件夹
```

#### 3. 在 Markdown 中引用

```markdown
<!-- 使用绝对路径（推荐） -->
![图片描述](/MyBlog/images/screenshot.png)

<!-- 文章特定图片 -->
![图片描述](/MyBlog/images/article-name/diagram.png)

<!-- 相对路径（不推荐，可能有问题） -->
![图片描述](./images/photo.jpg)
```

**⚠️ 重要提示：**

```markdown
# ❌ 错误示例（会导致 404）
![图片](/public/images/screenshot.png)      # 不要使用 /public 前缀
![图片](/images/screenshot.png)             # 缺少 base 路径前缀

# ✅ 正确示例
![图片](/MyBlog/images/screenshot.png)      # 必须包含 /MyBlog/ 前缀
```

**原因：**
- 项目配置了 `base: '/MyBlog/'`，用于 GitHub Pages 部署
- Vite 会将 `public/` 文件夹的内容复制到 `base` 路径下
- 所有本地资源路径都需要加上 `/MyBlog/` 前缀
- `public/images/test.png` → 访问路径：`/MyBlog/images/test.png`

#### 4. 项目结构示例

```
public/
├── images/                      # 通用图片目录
│   ├── logo.png                 # 访问路径: /MyBlog/images/logo.png
│   ├── avatar.jpg               # 访问路径: /MyBlog/images/avatar.jpg
│   ├── banner.webp              # 访问路径: /MyBlog/images/banner.webp
│   └── article-name/            # 按文章组织（推荐）
│       ├── diagram.png          # 访问路径: /MyBlog/images/article-name/diagram.png
│       ├── screenshot.png       # 访问路径: /MyBlog/images/article-name/screenshot.png
│       └── flow-chart.svg       # 访问路径: /MyBlog/images/article-name/flow-chart.svg
├── articles/                    # 文章目录
│   ├── react-tutorial.md
│   ├── python-guide.md
│   └── article-name.md
```

**文件位置 → 访问路径对应关系（含 base 路径）：**
- `public/images/test.png` → `/MyBlog/images/test.png`
- `public/images/article/img.jpg` → `/MyBlog/images/article/img.jpg`
- ⚠️ **错误示例：**
  - ❌ `public/images/test.png` → `/public/images/test.png`
  - ❌ `public/images/test.png` → `/images/test.png`（缺少 base 路径）

## 🎨 Markdown 图片语法

### 基础语法

```markdown
![替代文本](图片URL)
```

### 带标题的图片

```markdown
![替代文本](图片URL "鼠标悬停时显示的标题")
```

### 示例

```markdown
# 基础用法
![Python Logo](https://example.com/python-logo.png)

# 带标题
![React Diagram](https://example.com/react.png "React组件生命周期")

# 本地图片（需要包含 /MyBlog/ 前缀）
![性能对比图](/MyBlog/images/performance-comparison.png)

# 链接图片（点击可跳转）
[![点击访问](https://example.com/banner.png)](https://example.com)
```

## 📐 图片显示效果

已为所有文章图片添加了统一样式，具有以下特性：

- ✅ 自适应宽度（最大100%容器宽度）
- ✅ 自动高度保持比例
- ✅ 圆角边框（8px）
- ✅ 居中显示
- ✅ 轻微阴影效果
- ✅ 边框装饰
- ✅ 懒加载优化（lazy loading）

### 样式预览

```css
/* 图片样式 - 已自动应用 */
.md-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 24px auto;
  display: block;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## 🚀 最佳实践

### 1. 图片选择建议

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 🌐 博客文章配图 | 在线图床 | 不占用仓库空间，CDN加速 |
| 🎨 Logo、图标 | 本地存储 | 小文件，重要资源 |
| 📊 大量截图 | 在线图床 | 避免仓库过大 |
| 🔒 敏感/私有图片 | 本地存储 | 数据安全 |

### 2. 图片优化技巧

#### 📉 压缩图片

```bash
# 使用工具压缩图片
# TinyPNG: https://tinypng.com
# ImageOptim: https://imageoptim.com
# Squoosh: https://squoosh.app
```

#### 🎯 推荐图片格式

- **PNG**: 图标、Logo、透明背景
- **JPEG/JPG**: 照片、复杂图像
- **WebP**: 现代浏览器，体积更小（推荐）
- **SVG**: 矢量图、图表、简单图形

#### 📏 推荐尺寸

- **文章配图**: 宽度 800-1200px
- **缩略图**: 400-600px
- **Logo**: 200-400px
- **头图/Banner**: 1200-1920px

### 3. 文件命名规范

```bash
# ✅ 推荐的命名方式
react-hooks-lifecycle.png
python-async-workflow.jpg
performance-comparison-chart.png
user-profile-screenshot-2025.png

# ❌ 避免的命名方式
图片1.png                    # 中文文件名
IMG_20250930.jpg            # 无意义命名
my photo!@#.png             # 特殊字符
```

### 4. 图片加载优化

已自动为所有图片添加 `loading="lazy"` 属性，实现：
- ⚡ 延迟加载，提升首屏速度
- 📊 减少带宽消耗
- 🚀 更好的用户体验

## 🔧 常见问题

### ❓ 图片不显示怎么办？

1. **检查URL是否正确**
   ```bash
   # 测试图片链接
   curl -I https://你的图片URL
   ```

2. **检查图片格式**
   - 确保是 `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg` 等支持格式

3. **检查路径**
   - 本地图片确保放在 `public/` 目录下
   - 使用绝对路径（以 `/` 开头）

4. **检查权限**
   - GitHub仓库必须是公开的
   - 云存储确保开启了公共读权限

### ❓ GitHub 图片加载慢？

```markdown
# 解决方案1: 使用jsDelivr CDN加速
![描述](https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/路径/图片.png)

# 解决方案2: 使用专业图床
# 将GitHub图片下载后上传到国内图床
```

### ❓ 如何批量替换图片链接？

```bash
# 使用 sed 批量替换（macOS/Linux）
sed -i 's|github.com/.*/blob|raw.githubusercontent.com|g' public/articles/*.md

# 或使用编辑器的查找替换功能
# VSCode: Cmd/Ctrl + Shift + H
```

### ❓ 图片太大影响性能？

```markdown
# 1. 压缩图片
使用在线工具: TinyPNG, Squoosh

# 2. 使用WebP格式
转换工具: https://cloudconvert.com/png-to-webp

# 3. 使用图床的自动压缩功能
多数图床会自动优化图片大小
```

## 📝 完整示例

### 示例文章：使用在线图床

```markdown
---
title: "React Hooks 完全指南"
date: "2025-09-30"
tags: ["React", "JavaScript", "教程"]
excerpt: "深入理解 React Hooks 的使用方法和最佳实践"
---

# React Hooks 完全指南

React Hooks 改变了我们编写 React 组件的方式。

![React Logo](https://raw.githubusercontent.com/facebook/react/main/fixtures/logo.png "React官方Logo")

## useState Hook

useState 是最常用的 Hook 之一...

![useState示例图](https://i.imgur.com/useState-example.png)

## useEffect Hook

useEffect 让我们能在函数组件中执行副作用...

![useEffect流程图](/MyBlog/images/useEffect-diagram.png)
```

### 示例文章：使用本地图片

```markdown
---
title: "Python性能优化技巧"
date: "2025-09-30"
tags: ["Python", "性能优化"]
excerpt: "提升Python程序性能的10个实用技巧"
---

# Python性能优化技巧

![Python Logo](/MyBlog/images/python-logo.png "Python")

## 1. 使用生成器

生成器可以显著降低内存使用...

![内存对比图](/MyBlog/images/python-guide/memory-comparison.png "生成器vs列表内存使用对比")

## 2. 并发编程

使用asyncio提升IO密集型任务性能...

![并发流程图](/MyBlog/images/python-guide/async-flow-diagram.svg)
```

**📝 注意事项：**
1. ⚠️ **所有本地图片必须使用 `/MyBlog/images/` 开头的绝对路径**（包含 base 路径）
2. 建议按文章名称创建子文件夹组织图片（如 `/MyBlog/images/python-guide/`）
3. 不要使用 `/public/` 前缀
4. 不要使用相对路径（如 `./images/` 或 `../images/`）
5. 不要遗漏 `/MyBlog/` 前缀，否则会导致 404 错误

## 🎯 推荐工作流程

### 📸 添加图片的完整流程

#### 使用在线图床（推荐新手）

```bash
# 1. 准备图片
选择或创建你的图片

# 2. 上传到图床
访问 https://sm.ms 或 https://imgur.com
上传图片并复制链接

# 3. 在Markdown中使用
![图片描述](复制的图床链接)

# 4. 预览效果
npm run dev
```

#### 使用本地存储（推荐进阶用户）

```bash
# 1. 创建图片目录（首次）
mkdir -p public/images

# 2. 添加图片文件
cp ~/Downloads/screenshot.png public/images/

# 3. 在Markdown中引用（注意包含 /MyBlog/ 前缀）
![截图](/MyBlog/images/screenshot.png)

# 4. 提交到Git
git add public/images/screenshot.png
git commit -m "Add screenshot image"

# 5. 预览效果
npm run dev
```

## 📚 相关资源

- [TinyPNG - 图片压缩](https://tinypng.com)
- [Squoosh - 在线图片优化](https://squoosh.app)
- [SM.MS - 免费图床](https://sm.ms)
- [Imgur - 国际图床](https://imgur.com)
- [Can I Use WebP - 浏览器兼容性](https://caniuse.com/webp)

---

## 🎉 开始使用！

现在你已经掌握了在 MyBlog 中使用图片的所有方法，选择最适合你的方案开始创作吧！

**需要帮助？** 查看其他文档：
- 📚 [文章管理指南](./ARTICLES_GUIDE.md)
- 🚀 [部署指南](./DEPLOYMENT.md)
- 💻 [开发指南](./DEVELOPMENT.md)
