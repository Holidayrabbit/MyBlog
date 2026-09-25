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
      resume: 'Resume',
      
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
      technicalArticles: 'Technical Articles',
      technicalArticlesDesc: 'Programming experiences, tool reviews, and technical insights',
      academicResearch: 'Academic Research',
      academicResearchDesc: 'Academic achievements, research papers, and academic thoughts',
      openSourceProjects: 'Open Source Projects',
      openSourceProjectsDesc: 'My open source contributions and projects',
      personalResume: 'Personal Resume',
      personalResumeDesc: 'Learn more about my background and experience',
      
      // Articles page
      articlesTitle: 'Technical Articles',
      articlesDesc: 'Programming experiences, tool reviews, and technical insights',
      totalArticles: 'Total Articles',
      totalTags: 'Tags',
      lastUpdated: 'Last Updated',
      
      // Academic page
      academicTitle: 'Academic Research',
      academicDesc: 'Exploring the boundaries of knowledge, sharing academic research',
      researchInterests: 'Research Interests',
      publishedPapers: 'Published Papers',
      researchProjects: 'Research Projects',
      academicActivities: 'Academic Activities',
      contact: 'Contact',
      comingSoon: 'Coming Soon',
      
      // Projects page
      projectsTitle: 'Open Source Projects',
      projectsDesc: 'My contributions to the open source community',
      viewProject: 'View Project',
      viewCode: 'View Code',
      
      // Resume page
      resumeTitle: 'Personal Resume',
      resumeDesc: 'Download or view my latest resume',
      downloadResume: 'Download Resume',
      
      // Footer
      allRightsReserved: 'All rights reserved',
      
      // Stats
      papers: 'Papers',
      projects_count: 'Projects',
      conferences: 'Conferences',
      fields: 'Fields'
    }
  },
  zh: {
    translation: {
      // Navigation
      home: '首页',
      articles: '文章',
      academic: '学术',
      projects: '项目',
      resume: '简历',
      
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
      technicalArticles: '📝 技术文章',
      technicalArticlesDesc: '分享编程经验、工具评测和技术心得',
      academicResearch: '🎓 学术研究',
      academicResearchDesc: '学术成果、研究论文和学术思考',
      openSourceProjects: '💻 开源项目',
      openSourceProjectsDesc: '我的开源贡献和项目展示',
      personalResume: '📄 个人简历',
      personalResumeDesc: '了解更多关于我的背景和经历',
      
      // Articles page
      articlesTitle: '技术文章&碎碎念',
      articlesDesc: '分享技术心得、洞察和碎碎念',
      totalArticles: '总计文章',
      totalTags: '标签数量',
      lastUpdated: '最新更新',
      
      // Academic page
      academicTitle: '学术研究',
      academicDesc: '探索知识的边界，分享学术研究成果',
      researchInterests: '研究兴趣',
      publishedPapers: '发表论文',
      researchProjects: '研究项目',
      academicActivities: '学术活动',
      contact: '联系方式',
      comingSoon: '敬请期待',
      
      // Projects page
      projectsTitle: '开源项目',
      projectsDesc: '我对开源社区的贡献',
      viewProject: '查看项目',
      viewCode: '查看代码',
      
      // Resume page
      resumeTitle: '个人简历',
      resumeDesc: '下载或查看我的最新简历',
      downloadResume: '下载简历',
      
      // Footer
      allRightsReserved: '版权所有',
      
      // Stats
      papers: '发表论文',
      projects_count: '参与项目',
      conferences: '学术会议',
      fields: '研究领域'
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
