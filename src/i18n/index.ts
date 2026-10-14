import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      articles: 'Articles',
      academic: 'Academic',
      projects: 'Projects',
      resume: 'About',
      
      // Common
      readMore: 'Read More',
      back: 'Back',
      language: 'Language',
      theme: 'Theme',
      admin: 'Article Admin',
      
      // Home page
      welcome: 'Welcome to My Personal Website',
      subtitle: 'Sharing technical experiences, academic research, and life insights',
      latestArticles: 'Latest Articles',
      siteNavigation: 'Site Navigation',
      
      // Articles page
      articlesTitle: 'Technical Articles',
      articlesDesc: 'Programming experiences, tool reviews, and technical insights',
      totalArticles: 'Total Articles',
      totalTags: 'Tags',
      lastUpdated: 'Last Updated',
      
      // Academic page
      publishedPapers: 'Published Papers',
      researchProjects: 'Research Projects',
      academicActivities: 'Academic Activities',
      contact: 'Contact',
      comingSoon: 'Coming Soon',

      // Projects page
      viewProject: 'View Project',
      viewCode: 'View Code',

      // Personal homepage
      downloadResume: 'Download Resume',
      
      // Footer
      allRightsReserved: 'All rights reserved'
    }
  },
  zh: {
    translation: {
      // Navigation
      home: '首页',
      articles: '文章',
      academic: '学术',
      projects: '项目',
      resume: '个人主页',
      
      // Common
      readMore: '阅读全文',
      back: '返回',
      language: '语言',
      theme: '主题',
      admin: '文章管理',
      
      // Home page
      welcome: '欢迎来到我的个人网站',
      subtitle: '分享技术经验、学术研究和生活感悟',
      latestArticles: '最新文章',
      siteNavigation: '网站导航',
      
      // Articles page
      articlesTitle: '技术文章&碎碎念',
      articlesDesc: '分享技术心得、洞察和碎碎念',
      totalArticles: '总计文章',
      totalTags: '标签数量',
      lastUpdated: '最新更新',
      
      // Academic page
      publishedPapers: '发表论文',
      researchProjects: '研究项目',
      academicActivities: '学术活动',
      contact: '联系方式',
      comingSoon: '敬请期待',

      // Projects page
      viewProject: '查看项目',
      viewCode: '查看代码',
      
      // Personal homepage
      downloadResume: '下载简历',
      
      // Footer
      allRightsReserved: '版权所有'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'zh',
    fallbackLng: 'zh',
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
