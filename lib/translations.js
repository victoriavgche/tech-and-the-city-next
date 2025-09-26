// Translation system for Greek ↔ English
export const translations = {
  // Navigation
  nav: {
    home: {
      en: "Home",
      el: "Αρχική"
    },
    about: {
      en: "About",
      el: "Σχετικά"
    },
    articles: {
      en: "Articles",
      el: "Άρθρα"
    },
    events: {
      en: "Events",
      el: "Εκδηλώσεις"
    },
    contact: {
      en: "Contact",
      el: "Επικοινωνία"
    }
  },
  
  // Common
  common: {
    readMore: {
      en: "Read More",
      el: "Διάβασε Περισσότερα"
    },
    backToArticles: {
      en: "Back to Articles",
      el: "Επιστροφή στα Άρθρα"
    },
    loading: {
      en: "Loading...",
      el: "Φόρτωση..."
    },
    error: {
      en: "Error",
      el: "Σφάλμα"
    }
  },
  
  // Article related
  article: {
    publishedOn: {
      en: "Published on",
      el: "Δημοσιεύθηκε στις"
    },
    readTime: {
      en: "min read",
      el: "λεπτά ανάγνωση"
    },
    share: {
      en: "Share",
      el: "Κοινοποίηση"
    }
  }
};

// Get current language from localStorage or default to English
export function getCurrentLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
}

// Set current language
export function setCurrentLanguage(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    // Trigger a custom event to notify components of language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }
}

// Get translation for a key
export function t(key, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    value = value[k];
    if (!value) return key; // Return key if translation not found
  }
  
  return value[currentLang] || value['en'] || key;
}

// Translate text using Google Translate API (for dynamic content)
export async function translateText(text, targetLang, sourceLang = 'auto') {
  try {
    // For now, we'll use a simple approach with Google Translate
    // In production, you might want to use a proper translation service
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    
    if (data && data[0] && data[0][0]) {
      return data[0][0][0];
    }
    
    return text; // Return original if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original if translation fails
  }
}
