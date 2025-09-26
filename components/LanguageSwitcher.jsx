'use client';

import { useState, useEffect } from 'react';
import { getCurrentLanguage, setCurrentLanguage } from '../lib/translations';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'el' : 'en';
    setCurrentLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
      title={`Switch to ${currentLang === 'en' ? 'Greek' : 'English'}`}
    >
      <span className="text-lg">
        {currentLang === 'en' ? '🇬🇷' : '🇺🇸'}
      </span>
      <span className="hidden sm:inline">
        {currentLang === 'en' ? 'Ελληνικά' : 'English'}
      </span>
    </button>
  );
}
