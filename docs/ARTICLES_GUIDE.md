# 文章管理指南

文章统一通过**网页后台**管理（底层是仓库里 `public/articles/` 下的 Markdown 文件），保存后由 GitHub Actions 自动构建发布。

## 网页后台

访问 `/#/admin`（线上为 https://holidayrabbit.github.io/MyBlog/#/admin ）。

### 登录

点击"使用 GitHub 登录"，跳转 GitHub 授权后自动返回。依赖 Cloudflare Worker 中转（一次性配置，见
[cloudflare-worker/README.md](../cloudflare-worker/README.md)）。Worker 与前端都会校验账号必须是仓库所有者本人，非本人账号直接拒绝。

### 功能

- **文章列表**：从仓库实时读取，按日期排序，可编辑 / 预览 / 删除（删除时文章与其图片目录在同一个 commit 中移除，可从 git 历史恢复）
- **编辑器**：标题 / 日期 / 标签 / 摘要表单化填写，正文左侧 Markdown、右侧实时预览（与站点渲染一致）
- **新建文章**：标题自动生成文件名（英文转 kebab-case，中文直接沿用）
- **图片上传**：选择图片即在光标处插入引用，随文章保存在**同一个 commit** 中（不触发两次部署）
- **保存即发布**：每次保存 = 一个 commit（文章与图片打包），页面显示 GitHub Actions 构建状态（通常 1-2 分钟后线上可见）

### 草稿与冲突

- 编辑内容每 0.6 秒自动存入浏览器，误关页面重新打开会提示恢复，保存成功后自动清除
- 有未保存的图片时返回列表或刷新页面会收到确认提示，防止图片引用变成死链
- 保存基于最新的 main 分支构建提交，无需处理冲突；正文中未引用的图片不会上传

## frontmatter 字段

后台编辑器已把字段表单化，一般无需手写。如需直接编辑仓库中的 `*.md` 文件，格式如下：

```markdown
---
title: "文章标题"            # 建议填写
date: "2026-09-25"           # 缺省用文件修改时间
tags: ["Agent", "TypeScript"] # 缺省根据内容自动提取
excerpt: "摘要"              # 缺省截取正文前 200 字
---
```

正文支持完整 Markdown：GFM 表格、代码高亮、KaTeX 公式（`$...$`）等。

## 索引说明

`public/articles.json` 由 `scripts/generate-articles.js` 生成（CI 部署时自动执行），请勿手改。

## 常见问题

- **图片显示不出来**：确认引用路径以 `/MyBlog/` 开头（与 `vite.config.ts` 的 `base` 一致），且文件名大小写与实际文件一致
- **文章没出现在线上列表里**：等 Actions 构建完成（后台的部署状态徽章会显示进度）
- **本地开发时无法走 OAuth**：GitHub 回调固定指向线上站点，调试后台请直接访问线上地址
