import React from 'react';
import { useTranslation } from 'react-i18next';

// 模拟研究兴趣数据
const researchInterests = [
  'LLM Agent', '机器学习', '自然语言处理', '软件安全'
];

// 模拟统计数据
const academicStats = {
  papers: 1,
  projects: 1,
  conferences: 1,
  fields: 1
};

const Academic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('academicTitle')}</h1>
        <p className="page-description">{t('academicDesc')}</p>
      </div>

      <div className="academic-layout">
        <section className="research-interests">
          <h2 className="section-title">{t('researchInterests')}</h2>
          <div className="interests-tags">
            {researchInterests.map((interest) => (
              <span key={interest} className="interest-tag">{interest}</span>
            ))}
          </div>
        </section>

        <section className="academic-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{academicStats.papers}</div>
              <div className="stat-label">{t('papers')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{academicStats.projects}</div>
              <div className="stat-label">{t('projects_count')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{academicStats.conferences}</div>
              <div className="stat-label">{t('conferences')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{academicStats.fields}</div>
              <div className="stat-label">{t('fields')}</div>
            </div>
          </div>
        </section>

        <section className="academic-section">
          <h2 className="section-title">{t('publishedPapers')}</h2>
          <div className="coming-soon">
            <h3>{t('comingSoon')}</h3>
            <p>学术论文正在整理中，即将发布</p>
          </div>
        </section>

        <section className="academic-section">
          <h2 className="section-title">{t('researchProjects')}</h2>
          <div className="coming-soon">
            <h3>{t('comingSoon')}</h3>
            <p>研究项目信息正在整理中，即将发布</p>
          </div>
        </section>

        <section className="academic-section">
          <h2 className="section-title">{t('academicActivities')}</h2>
          <div className="coming-soon">
            <h3>{t('comingSoon')}</h3>
            <p>学术活动信息正在整理中，即将发布</p>
          </div>
        </section>

        <section className="contact-section">
          <h2 className="section-title">{t('contact')}</h2>
          <div className="contact-info">
            <p>如果您对我的研究感兴趣，欢迎通过以下方式联系我：</p>
            <div className="contact-links">
              <a href="mailto:zhaoqie888@icloud.com" className="contact-link">
                📧 Email: zhaoqie888@icloud.com
              </a>
              <a href="https://www.linkedin.com/in/fulin-zhao-261479308/" target="_blank" rel="noopener noreferrer" className="contact-link">
                💼 LinkedIn
              </a>
              <a href="https://github.com/Holidayrabbit" target="_blank" rel="noopener noreferrer" className="contact-link">
                🐱 GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Academic;
