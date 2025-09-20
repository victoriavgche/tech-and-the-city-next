'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function SimpleLanguageSwitcher() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('site-language') || 'en';
    setLanguage(savedLang);
    
    // Apply language to document
    document.documentElement.lang = savedLang;
  }, []);

  const switchLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('site-language', newLang);
    document.documentElement.lang = newLang;
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLang }));
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white hover:border-gray-400 transition-all duration-200">
        <Globe className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-600 uppercase font-medium">
          {language === 'gr' ? 'ΕΛ' : 'EN'}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => switchLanguage('en')}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-200 rounded-t-lg ${
            language === 'en' ? 'text-blue-600 font-medium' : 'text-gray-600'
          }`}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => switchLanguage('gr')}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-200 rounded-b-lg ${
            language === 'gr' ? 'text-blue-600 font-medium' : 'text-gray-600'
          }`}
        >
          🇬🇷 Ελληνικά
        </button>
      </div>
    </div>
  );
}

