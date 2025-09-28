import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github } from 'lucide-react';

// 模拟项目数据
const mockProjects = [
  {
    id: '1',
    name: 'Personal Blog System',
    description: '基于React+TypeScript的极简个人博客系统，支持markdown文章、主题切换、国际化等功能',
    url: 'https://ZhaoQie.cv',
    github: 'https://github.com/ZhaoQie-Li97/blog',
    tags: ['React', 'TypeScript', 'Markdown', 'GitHub Pages']
  },
  {
    id: '2',
    name: 'Data Visualization Tool',
    description: '用于科学数据可视化的工具库，支持多种图表类型和交互功能',
    url: '#',
    github: 'https://github.com/ZhaoQie-Li97/data-viz',
    tags: ['Python', 'D3.js', 'Data Science', 'Visualization']
  },
  {
    id: '3',
    name: 'Research Paper Manager',
    description: '学术论文管理工具，支持文献检索、分类整理和引用管理',
    url: '#',
    github: 'https://github.com/ZhaoQie-Li97/paper-manager',
    tags: ['Python', 'Web Scraping', 'Academic', 'Database']
  }
];

const Projects: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('projectsTitle')}</h1>
        <p className="page-description">{t('projectsDesc')}</p>
      </div>

      <div className="projects-grid">
        {mockProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3 className="project-name">{project.name}</h3>
              <div className="project-links">
                {project.url !== '#' && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project-link"
                    title={t('viewProject')}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                  title={t('viewCode')}
                >
                  <Github size={18} />
                </a>
              </div>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="projects-stats">
        <div className="stat-item">
          <span className="stat-icon">💻</span>
          <span className="stat-label">开源项目：</span>
          <span className="stat-value">{mockProjects.length}个</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🏷️</span>
          <span className="stat-label">技术栈：</span>
          <span className="stat-value">
            {Array.from(new Set(mockProjects.flatMap(p => p.tags))).length}种
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📅</span>
          <span className="stat-label">最新更新：</span>
          <span className="stat-value">2025年9月28日</span>
        </div>
      </div>
    </div>
  );
};

export default Projects;
