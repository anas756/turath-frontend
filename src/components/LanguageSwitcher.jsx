import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'ar', label: 'ع',  full: 'العربية' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setOpen(false);
  };

  return (
    <div className="lang-switcher">
      <button className="lang-trigger" onClick={() => setOpen(!open)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>{current.label}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`lang-option ${current.code === lang.code ? 'active' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="lang-code">{lang.label}</span>
              <span className="lang-full">{lang.full}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}