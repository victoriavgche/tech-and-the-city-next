'use client';

import { useState, useEffect, useCallback } from 'react';
import { translateText, getCurrentLanguage, detectLanguage } from '../lib/translations';
import { Loader2, AlertCircle } from 'lucide-react';

// ==========================================
// SMART ARTICLE TRANSLATOR
// With intelligent caching and error handling
// ==========================================

export default function ArticleTranslator({ content, title, excerpt }) {
  const [translatedContent, setTranslatedContent] = useState('');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedExcerpt, setTranslatedExcerpt] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const [originalLang, setOriginalLang] = useState('en');
  const [progress, setProgress] = useState(0);

  // Store original content
  const [originalContent] = useState({
    content: content || '',
    title: title || '',
    excerpt: excerpt || ''
  });

  // Detect original language once
  useEffect(() => {
    // Detect from content first (more reliable), fallback to title
    const detected = detectLanguage(originalContent.content || originalContent.title);
    setOriginalLang(detected);
    console.log(`📝 Original language detected: ${detected}`);
  }, [originalContent]);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
    
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Translate when language changes
  useEffect(() => {
    if (currentLang !== originalLang) {
      translateArticle(currentLang);
    } else {
      // Show original content
      setTranslatedContent('');
      setTranslatedTitle('');
      setTranslatedExcerpt('');
      setTranslationError('');
    }
  }, [currentLang, originalLang]);

  const translateArticle = useCallback(async (targetLang) => {
    if (!targetLang || targetLang === originalLang) return;
    
    console.log(`🌐 Starting translation to ${targetLang}...`);
    setIsTranslating(true);
    setTranslationError('');
    setProgress(0);
    
    try {
      let completed = 0;
      const total = 3; // title, excerpt, content

      // Translate title
      if (originalContent.title) {
        const title = await translateText(originalContent.title, targetLang, originalLang);
        setTranslatedTitle(title);
        completed++;
        setProgress((completed / total) * 100);
      }
      
      // Translate excerpt
      if (originalContent.excerpt) {
        const excerpt = await translateText(originalContent.excerpt, targetLang, originalLang);
        setTranslatedExcerpt(excerpt);
        completed++;
        setProgress((completed / total) * 100);
      }
      
      // Translate content while preserving EXACT HTML structure and spacing
      if (originalContent.content) {
        // Check if we're in browser (DOMParser only works client-side)
        if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
          // Fallback for server-side: simple text extraction
          const textOnly = originalContent.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const translatedText = await translateText(textOnly, targetLang, originalLang);
          setTranslatedContent(originalContent.content.replace(textOnly, translatedText));
          completed++;
          setProgress(100);
          return;
        }
        
        // Parse HTML to preserve exact structure (client-side only)
        const parser = new DOMParser();
        const doc = parser.parseFromString(originalContent.content, 'text/html');
        
        // Get all elements including empty ones to preserve spacing
        const allElements = Array.from(doc.body.children);
        
        if (allElements.length > 0) {
          // Process each element
          const processedElements = [];
          
          for (const element of allElements) {
            const text = element.textContent.trim();
            
            if (text) {
              // Element has text - translate it
              processedElements.push({
                text,
                tag: element.tagName.toLowerCase(),
                classes: element.className,
                style: element.getAttribute('style'),
                outerHTML: element.outerHTML
              });
            } else {
              // Empty element - keep as is for spacing
              processedElements.push({
                text: '',
                outerHTML: element.outerHTML,
                isEmpty: true
              });
            }
          }
          
          // Translate only non-empty elements
          const textsToTranslate = processedElements
            .filter(el => !el.isEmpty)
            .map(el => el.text);
          
          const translations = await Promise.all(
            textsToTranslate.map(text => translateText(text, targetLang, originalLang))
          );
          
          // Reconstruct HTML maintaining exact structure with single line spacing
          let translationIndex = 0;
          const htmlElements = processedElements.map(el => {
            if (el.isEmpty) {
              // Skip empty elements - we'll add consistent spacing
              return null;
            } else {
              // Replace text in element
              const translatedText = translations[translationIndex++];
              const classes = el.classes ? ` class="${el.classes}"` : '';
              const style = el.style ? ` style="${el.style}"` : '';
              return `<${el.tag}${classes}${style}>${translatedText}</${el.tag}>`;
            }
          }).filter(el => el !== null); // Remove empty elements
          
          // Join with proper spacing between paragraphs
          const restoredHtml = htmlElements.join('\n');
          
          setTranslatedContent(restoredHtml);
          completed++;
          setProgress(100);
        } else {
          // Fallback: use original content structure
          const text = doc.body.textContent.trim();
          const translatedText = await translateText(text, targetLang, originalLang);
          setTranslatedContent(`<p>${translatedText}</p>`);
          completed++;
          setProgress(100);
        }
      }

      console.log('✓ Translation completed successfully');
    } catch (error) {
      console.error('❌ Translation error:', error);
      setTranslationError(
        currentLang === 'el' 
          ? 'Η μετάφραση απέτυχε. Παρακαλώ δοκιμάστε ξανά.'
          : 'Translation failed. Please try again.'
      );
      setTranslatedContent(originalContent.content);
    } finally {
      setIsTranslating(false);
      setProgress(0);
    }
  }, [originalContent, originalLang, currentLang]);

  // Determine what to display
  const shouldShowTranslation = currentLang !== originalLang && (translatedContent || translatedTitle || translatedExcerpt);
  const displayTitle = shouldShowTranslation && translatedTitle ? translatedTitle : originalContent.title;
  const displayExcerpt = shouldShowTranslation && translatedExcerpt ? translatedExcerpt : originalContent.excerpt;
  const displayContent = shouldShowTranslation && translatedContent ? translatedContent : originalContent.content;

  return (
    <div className="space-y-4">
      {/* Translation Status */}
      {isTranslating && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-400">
                  {currentLang === 'el' 
                    ? 'Μετάφραση σε εξέλιξη...'
                    : 'Translating...'
                  }
                </span>
                <span className="text-xs text-blue-300">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Translation Error */}
      {translationError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{translationError}</span>
          </div>
        </div>
      )}


      {/* Article Content */}
      <div>
        {displayContent && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: displayContent
                .replace(/<p><br><\/p>/g, '')
                .replace(/<p\s+class="[^"]*"><br><\/p>/g, '')
                .replace(/<p>/g, '<p style="margin-bottom: 1rem; text-align: justify; line-height: 1.8; color: #cbd5e1;">')
                .replace(/<p\s+class="([^"]*)">/g, '<p class="$1" style="margin-bottom: 1rem; text-align: justify; line-height: 1.8; color: #cbd5e1;">')
            }} 
            style={{ 
              textAlign: 'justify',
              lineHeight: '1.8',
              color: '#cbd5e1'
            }}
          />
        )}
      </div>
    </div>
  );
}

