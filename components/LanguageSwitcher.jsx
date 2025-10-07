'use client';

import { useState, useEffect } from 'react';
import { getCurrentLanguage, setCurrentLanguage } from '../lib/translations';

// ==========================================
// BEAUTIFUL LANGUAGE SWITCHER
// With smooth animations and modern UI
// ==========================================

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
    
    // Listen for language changes from other components
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    if (lang === currentLang) return; // Already selected
    
    setIsAnimating(true);
    setCurrentLanguage(lang);
    setCurrentLang(lang);
    
    // Reset animation after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'el' : 'en';
    handleLanguageChange(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400"
    >
      {currentLang === 'en' ? 'EN' : 'EL'}
    </button>
  );
}

