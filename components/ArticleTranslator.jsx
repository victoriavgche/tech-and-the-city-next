'use client';

import { useState, useEffect } from 'react';
import { translateText } from '../lib/translations';

export default function ArticleTranslator({ 
  title, 
  excerpt, 
  content, 
  onTranslate 
}) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedExcerpt, setTranslatedExcerpt] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentLang(localStorage.getItem('language') || 'en');
    }
  }, []);

  const handleTranslate = async () => {
    setIsTranslating(true);
    
    try {
      const targetLang = currentLang === 'en' ? 'el' : 'en';
      
      // Translate title
      const titleTranslation = await translateText(title, targetLang);
      setTranslatedTitle(titleTranslation);
      
      // Translate excerpt
      const excerptTranslation = await translateText(excerpt, targetLang);
      setTranslatedExcerpt(excerptTranslation);
      
      // Translate content (first 500 characters for preview)
      const contentPreview = content.substring(0, 500) + '...';
      const contentTranslation = await translateText(contentPreview, targetLang);
      setTranslatedContent(contentTranslation);
      
      // Call parent callback with translations
      if (onTranslate) {
        onTranslate({
          title: titleTranslation,
          excerpt: excerptTranslation,
          content: contentTranslation,
          language: targetLang
        });
      }
      
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">
          {currentLang === 'en' ? '🇬🇷 Greek Translation' : '🇺🇸 English Translation'}
        </h3>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>
      
      {(translatedTitle || translatedExcerpt || translatedContent) && (
        <div className="space-y-3">
          {translatedTitle && (
            <div>
              <h4 className="text-cyan-400 font-semibold mb-1">Title:</h4>
              <p className="text-gray-300">{translatedTitle}</p>
            </div>
          )}
          
          {translatedExcerpt && (
            <div>
              <h4 className="text-cyan-400 font-semibold mb-1">Excerpt:</h4>
              <p className="text-gray-300">{translatedExcerpt}</p>
            </div>
          )}
          
          {translatedContent && (
            <div>
              <h4 className="text-cyan-400 font-semibold mb-1">Content Preview:</h4>
              <p className="text-gray-300">{translatedContent}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
