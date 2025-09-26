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
  },
  
  // Footer
  footer: {
    sections: {
      en: "SECTIONS",
      el: "ΕΝΟΤΗΤΕΣ"
    },
    followUs: {
      en: "FOLLOW US",
      el: "ΑΚΟΛΟΥΘΗΣΤΕ ΜΑΣ"
    },
    madeWith: {
      en: "Made with attitude",
      el: "Φτιαγμένο με στάση"
    },
    allRights: {
      en: "All rights reserved",
      el: "Όλα τα δικαιώματα διατηρούνται"
    },
    privacyPolicy: {
      en: "Privacy Policy",
      el: "Πολιτική Απορρήτου"
    },
    termsOfService: {
      en: "Terms of Service",
      el: "Όροι Χρήσης"
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
    // Use a more reliable translation approach
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
    const data = await response.json();
    
    if (data && data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    }
    
    // Fallback to Google Translate
    const googleResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const googleData = await googleResponse.json();
    
    if (googleData && googleData[0] && googleData[0][0]) {
      return googleData[0][0][0];
    }
    
    return text; // Return original if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original if translation fails
  }
}
