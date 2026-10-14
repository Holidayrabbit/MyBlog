// 首页「网站导航」名单：增删站点只需编辑下面的 navigationGroups 数组。
//
// 单个站点字段：
//   name  站点名称（原样展示，不参与翻译）
//   url   站点链接（新窗口打开）
//   icon  展示用的 emoji，可随意替换
//   desc  一句话简介，zh / en 各写一份
//
// 分组字段：
//   key   分组唯一标识
//   name  分组标题，zh / en 各写一份
//   links 该分组下的站点列表

export type Language = 'zh' | 'en';

export interface NavLinkItem {
  name: string;
  url: string;
  icon: string;
  desc: Record<Language, string>;
}

export interface NavLinkGroup {
  key: string;
  name: Record<Language, string>;
  links: NavLinkItem[];
}

export const navigationGroups: NavLinkGroup[] = [
  {
    key: 'social',
    name: { zh: '社交媒体', en: 'Social Media' },
    links: [
      {
        name: 'X (Twitter)',
        url: 'https://x.com',
        icon: '🐦',
        desc: { zh: '即时动态与观点广场', en: 'Real-time posts and opinions' },
      },
      {
        name: '微博',
        url: 'https://weibo.com',
        icon: '📣',
        desc: { zh: '中文社交媒体平台', en: 'Chinese social media platform' },
      },
      {
        name: '知乎',
        url: 'https://www.zhihu.com',
        icon: '💡',
        desc: { zh: '中文问答与深度讨论社区', en: 'Chinese Q&A community' },
      },
      {
        name: 'Bilibili',
        url: 'https://www.bilibili.com',
        icon: '📺',
        desc: { zh: '视频社区与学习资源', en: 'Videos with rich learning content' },
      },
      {
        name: 'Reddit',
        url: 'https://www.reddit.com',
        icon: '👽',
        desc: { zh: '全球最大的论坛社区', en: 'The front page of the internet' },
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com',
        icon: '💼',
        desc: { zh: '职业社交网络', en: 'Professional networking' },
      },
    ],
  },
  {
    key: 'tech',
    name: { zh: '技术社区', en: 'Tech Communities' },
    links: [
      {
        name: 'Hacker News',
        url: 'https://news.ycombinator.com',
        icon: '🟠',
        desc: { zh: 'YC 旗下科技新闻社区', en: 'Tech news by Y Combinator' },
      },
      {
        name: '齐思（奇绩创坛）',
        url: 'https://news.miracleplus.com',
        icon: '🚀',
        desc: { zh: '奇绩创坛的中文版 Hacker News', en: 'Chinese Hacker News by MiraclePlus' },
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        icon: '🐙',
        desc: { zh: '全球最大的代码托管平台', en: 'Code hosting and open source' },
      },
      {
        name: '掘金',
        url: 'https://juejin.cn',
        icon: '⛏️',
        desc: { zh: '中文开发者技术社区', en: 'Chinese developer community' },
      },
      {
        name: 'V2EX',
        url: 'https://www.v2ex.com',
        icon: '💬',
        desc: { zh: '创意工作者社区', en: 'Community for creative workers' },
      },
      {
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        icon: '🧱',
        desc: { zh: '程序员问答社区', en: 'Q&A community for programmers' },
      },
      {
        name: '少数派',
        url: 'https://sspai.com',
        icon: '🧰',
        desc: { zh: '高质量数字工具指南', en: 'Digital tools and productivity' },
      },
      {
        name: 'Product Hunt',
        url: 'https://www.producthunt.com',
        icon: '🔍',
        desc: { zh: '发现新产品的地方', en: 'Discover new products' },
      },
    ],
  },
];
