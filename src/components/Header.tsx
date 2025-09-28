import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('articles'), href: '/articles' },
    { name: t('academic'), href: '/academic' },
    { name: t('projects'), href: '/projects' },
    { name: t('resume'), href: '/resume' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            ZhaoQie
          </Link>
          
          <nav className="nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="controls">
            <button 
              onClick={toggleLanguage}
              className="control-btn"
              title={t('language')}
            >
              <Globe size={18} />
            </button>
            <button 
              onClick={toggleTheme}
              className="control-btn"
              title={t('theme')}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
