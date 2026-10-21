import React from 'react';
import { useTranslation } from 'react-i18next';
import { Rss } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          © {currentYear} ZhaoQie. {t('allRightsReserved')}.
          <a
            href={`${import.meta.env.BASE_URL}rss.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="rss-link"
            title={t('rssSubscribe')}
          >
            <Rss size={16} />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
