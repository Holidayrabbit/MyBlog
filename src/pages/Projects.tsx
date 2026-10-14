import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github } from 'lucide-react';

// 模拟项目数据
const mockProjects = [
  {
    id: '1',
    name: 'MyBlog',
    description: '基于React+TypeScript的极简个人博客系统，拒绝一切不必要的功能，设计灵感来自Anthropic官网。支持markdown文章、主题切换、中英文切换等功能。',
    url: 'https://holidayrabbit.github.io/MyBlog/',
    github: 'https://github.com/Holidayrabbit/MyBlog',
    tags: ['React', 'TypeScript', 'Markdown', 'GitHub Pages']
  },
  {
    id: '2',
    name: 'Aibrary: AI-native podcast platform',
    description: '在Ouraca实习时参与的项目，结合LLM、经典书籍与现代流行的播客，打造个人线上图书馆。',
    url: 'https://aibrary-portal.vercel.app/',
    github: '#',
    tags: ['Python', 'Langchain', 'LlamaIndex']
  }
];

const Projects: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
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
    </div>
  );
};

export default Projects;
