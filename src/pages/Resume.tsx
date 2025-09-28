import React from 'react';
import { useTranslation } from 'react-i18next';
import PDFViewer from '../components/PDFViewer';
import '../components/PDFViewer.css';

const Resume: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('resumeTitle')}</h1>
        <p className="page-description">{t('resumeDesc')}</p>
      </div>

      <div className="resume-content">
        <div className="resume-preview">
          <PDFViewer file={`${import.meta.env.BASE_URL}pdfs/resume.pdf`} className="modern-pdf-viewer" />
        </div>

        <div className="resume-summary">
          <section className="summary-section">
            <h2>个人简介</h2>
            <div className="summary-content">
              <div className="summary-header">
                <div className="avatar">ZQ</div>
                <div className="info">
                  <h3>ZhaoQie</h3>
                  <p>技术爱好者 & 研究者</p>
                </div>
              </div>
              <p>
                我是一名对Tech充满热情的开发者和研究者，专注于LLM Agent研究。
                我喜欢探索新的技术，解决实际问题，并通过写作分享我的经验和见解。
              </p>
            </div>
          </section>

          <section className="summary-section">
            <h2>技能专长</h2>
            <div className="skills-grid">
              <div className="skill-category">
                <h4>编程语言</h4>
                <div className="skill-tags">
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">Typescript</span>
                  <span className="skill-tag">Ruby</span>
                  <span className="skill-tag">SQL</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>技术栈</h4>
                <div className="skill-tags">
                  <span className="skill-tag">机器学习</span>
                  <span className="skill-tag">大语言模型技术</span>
                  <span className="skill-tag">Web全栈开发</span>
                  <span className="skill-tag">软件逆向工程</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>软技能</h4>
                <div className="skill-tags">
                  <span className="skill-tag">问题解决</span>
                  <span className="skill-tag">团队协作</span>
                </div>
              </div>
            </div>
          </section>

          <section className="summary-section">
            <h2>经历</h2>
            <div className="experience-list">
              <div className="experience-item">
                <div className="experience-period">2024 - 至今</div>
                <div className="experience-content">
                  <h4>人工智能研究者</h4>
                  <p>从事LLM Agent、ML、AI for Security领域的研究</p>
                </div>
              </div>
              
              <div className="experience-item">
                <div className="experience-period">2021 - 2024</div>
                <div className="experience-content">
                  <h4>人工智能学习者</h4>
                  <p>深入学习机器学习和人工智能的理论知识</p>
                </div>
              </div>
            </div>
          </section>

          <section className="summary-section">
            <h2>联系方式</h2>
            <div className="contact-grid">
              <a href="mailto:zhaoqie888@icloud.com" className="contact-item">
                📧 ZhaoQie's Email
              </a>
              <a href="https://github.com/Holidayrabbit" target="_blank" rel="noopener noreferrer" className="contact-item">
                🔗 GitHub
              </a>
              <a href="https://www.linkedin.com/in/fulin-zhao-261479308/" target="_blank" rel="noopener noreferrer" className="contact-item">
                💼 LinkedIn
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;
