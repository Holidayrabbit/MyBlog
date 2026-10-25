/**
 * giscus 评论配置（基于 GitHub Discussions，无后端）。
 *
 * 首次启用只需 3 步（详见 docs/COMMENTS_SETUP.md）：
 *   1. 在仓库 Settings → General → Features 勾选 Discussions；
 *   2. 安装 giscus App：https://github.com/apps/giscus（授予本仓库权限）；
 *   3. 打开 https://giscus.app/zh-CN，填入仓库名，
 *      把页面生成的 data-repo-id / data-category-id 抄到下面。
 *
 * 保持占位符不变时，评论区不会渲染，站点其他功能不受影响。
 */
export const GISCUS_CONFIG = {
  repo: 'Holidayrabbit/MyBlog',
  repoId: 'R_kgDOP4P6Gg', // 形如 R_kgDOLxxxxx
  category: 'Announcements', // 建议选 Announcements（只有维护者能开新讨论）
  categoryId: 'DIC_kwDOP4P6Gs4DJjxU', // 形如 DIC_kwDOLxxxxx
  mapping: 'pathname',
  strict: true,
  reactionsEnabled: true,
  inputPosition: 'top' as const,
  lazyLoad: true,
};

export const isGiscusConfigured = (): boolean =>
  GISCUS_CONFIG.repoId.startsWith('R_') && GISCUS_CONFIG.categoryId.startsWith('DIC_');
