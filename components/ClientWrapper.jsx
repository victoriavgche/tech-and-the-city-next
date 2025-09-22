'use client';

import { useTranslation } from '../lib/useTranslation';
import TranslatedContent from './TranslatedContent';

export default function ClientWrapper({ children, content, originalLanguage, skipTranslation = false }) {
  const { language } = useTranslation();
  
  if (content) {
    // Detect if content is Greek (has Greek characters)
    const isGreek = /[α-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏ]/.test(content);
    const detectedLang = isGreek ? 'gr' : 'en';
    
    return (
      <TranslatedContent 
        content={content}
        originalLanguage={originalLanguage || detectedLang}
        targetLanguage={language}
        skipTranslation={skipTranslation}
      />
    );
  }
  
  return children;
}
