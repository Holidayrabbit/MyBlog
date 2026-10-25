# 评论系统配置指南（giscus）

博客使用 [giscus](https://giscus.app/zh-CN) 提供评论功能：评论以 GitHub Discussions 的形式存在 `Holidayrabbit/MyBlog` 仓库中，无需任何后端和数据库。

代码已就绪（`src/components/Comments.tsx`），只需完成一次性的 3 步配置：

## 1. 开启 Discussions

GitHub 仓库 → **Settings → General → Features** → 勾选 **Discussions**。

## 2. 安装 giscus App

打开 <https://github.com/apps/giscus> → **Install** → 仅授予 `Holidayrabbit/MyBlog` 仓库权限。

## 3. 填入 ID

打开 <https://giscus.app/zh-CN>，在「仓库」填 `Holidayrabbit/MyBlog`，映射方式选 **pathname**，讨论分类建议选 **Announcements**（只有维护者能新建讨论，访客只能评论跟帖，不会被灌水）。

把页面生成的两个 ID 填到 `src/config/comments.ts`：

```ts
repoId: 'R_kgDO...',     // data-repo-id
categoryId: 'DIC_kwDO...', // data-category-id
```

push 后评论区即出现在每篇文章底部。配置完成前组件自动隐藏，不影响站点其他功能。

## 说明

- **主题**：评论区跟随博客明暗主题实时切换（通过 giscus 官方 postMessage 协议）。
- **语言**：跟随站点中英文切换（zh-CN / en）。
- **多语言评论隔离**：按 URL pathname 映射，中英文访问同一篇文章共享同一讨论串。
- **审核**：在仓库 Discussions 页面管理（删除/锁定/置顶），支持 reactions。
