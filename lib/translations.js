'use client';

// ==========================================
// PROFESSIONAL TRANSLATION SYSTEM
// With intelligent caching and error handling
// ==========================================

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Get current language from localStorage
export function getCurrentLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
}

// Set current language and notify all components
export function setCurrentLanguage(lang) {
  if (typeof window !== 'undefined') {
    const oldLang = getCurrentLanguage();
    localStorage.setItem('language', lang);
    
    // Trigger custom event for reactive updates
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang, previousLanguage: oldLang } 
    }));
    
    console.log(`Language changed: ${oldLang} → ${lang}`);
  }
}

// Generate cache key for translations
function getCacheKey(text, targetLang, sourceLang) {
  return `${sourceLang}:${targetLang}:${text.substring(0, 100)}`;
}

// Main translation function with intelligent caching
export async function translateText(text, targetLang, sourceLang = 'auto') {
  if (!text || text.trim() === '') {
    return text;
  }

  // Check cache first
  const cacheKey = getCacheKey(text, targetLang, sourceLang);
  if (translationCache.has(cacheKey)) {
    console.log('✓ Using cached translation');
    return translationCache.get(cacheKey);
  }

  try {
    console.log(`🌐 Translating to ${targetLang}:`, text.substring(0, 50) + '...');
    
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.translatedText) {
        // Cache the successful translation
        translationCache.set(cacheKey, data.translatedText);
        console.log('✓ Translation successful');
        return data.translatedText;
      }
    }
    
    console.warn('⚠️ Translation failed, returning original');
    return text;
  } catch (error) {
    console.error('❌ Translation error:', error);
    return text;
  }
}

// Batch translate multiple texts (more efficient)
export async function translateBatch(texts, targetLang, sourceLang = 'auto') {
  const promises = texts.map(text => translateText(text, targetLang, sourceLang));
  return await Promise.all(promises);
}

// Clear translation cache (useful for freeing memory)
export function clearTranslationCache() {
  translationCache.clear();
  console.log('🗑️ Translation cache cleared');
}

// Get cache statistics
export function getCacheStats() {
  return {
    size: translationCache.size,
    keys: Array.from(translationCache.keys()).slice(0, 5) // First 5 keys
  };
}

// ==========================================
// UI TRANSLATIONS (Static)
// ==========================================

export const uiTranslations = {
  nav: {
    home: { en: "Home", el: "Αρχική" },
    about: { en: "About", el: "Σχετικά" },
    articles: { en: "Articles", el: "Άρθρα" },
    events: { en: "Events", el: "Εκδηλώσεις" },
    contact: { en: "Contact", el: "Επικοινωνία" }
  },
  common: {
    readMore: { en: "Read More", el: "Διάβασε Περισσότερα" },
    backToArticles: { en: "Back to Articles", el: "Επιστροφή στα Άρθρα" },
    backToHome: { en: "Back to Home", el: "Επιστροφή στην Αρχική" },
    loading: { en: "Loading...", el: "Φόρτωση..." },
    translating: { en: "Translating...", el: "Μετάφραση..." },
    readArticle: { en: "Read Article", el: "Διάβασε Άρθρο" }
  },
  articles: {
    title: { en: "Articles", el: "Άρθρα" },
    noArticles: { en: "No articles found", el: "Δεν βρέθηκαν άρθρα" }
  }
};

// Get static UI translation
export function t(key, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  const keys = key.split('.');
  let value = uiTranslations;
  
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  
  return value[currentLang] || value['en'] || key;
}

// Detect if text is Greek or English
export function detectLanguage(text) {
  // Simple Greek character detection
  const greekChars = /[\u0370-\u03FF\u1F00-\u1FFF]/;
  return greekChars.test(text) ? 'el' : 'en';
}

