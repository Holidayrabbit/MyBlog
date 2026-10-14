import React from 'react';
import { useTranslation } from 'react-i18next';

const Academic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="academic-layout">
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
