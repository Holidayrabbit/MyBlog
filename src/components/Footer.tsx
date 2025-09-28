import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          © {currentYear} ZhaoQie. {t('allRightsReserved')}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
