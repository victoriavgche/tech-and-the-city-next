'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      home: "Home",
      articles: "Articles", 
      events: "Events",
      about: "About",
      subscribe: "Subscribe",
      contact: "Contact",
    },
    footer: {
      sections: "Sections",
      connect: "Connect",
    },
    home: {
      title: "Culture × Tech, with a pulse.",
      subtitle: "Essays, on‑feet interviews, and field notes from the European startup scene. No fluff, just signal.",
      latest: "Latest",
      viewAll: "View all →",
      readArticle: "Read article"
    },
    articles: {
      title: "Articles"
    },
    about: {
      title: "About",
      description: "Tech & the City is a culture × tech journal. We cover European startups with Athens energy — essays, on‑feet interviews, and field notes."
    },
    events: {
      title: "Events"
    },
    subscribe: {
      title: "Subscribe"
    }
  },
  gr: {
    nav: {
      home: "Αρχική",
      articles: "Άρθρα",
      events: "Εκδηλώσεις", 
      about: "Σχετικά",
      subscribe: "Εγγραφή",
      contact: "Επικοινωνία",
    },
    footer: {
      sections: "Ενότητες",
      connect: "Σύνδεση",
    },
    home: {
      title: "Κουλτούρα × Τεχνολογία, με παλμό.",
      subtitle: "Δοκίμια, συνεντεύξεις στον δρόμο και σημειώσεις από την ευρωπαϊκή startup σκηνή. Χωρίς φλύαρες, μόνο ουσία.",
      latest: "Τελευταία",
      viewAll: "Δες όλα →", 
      readArticle: "Διάβασε το άρθρο"
    },
    articles: {
      title: "Άρθρα"
    },
    about: {
      title: "Σχετικά",
      description: "Το Tech & the City είναι ένα περιοδικό κουλτούρας × τεχνολογίας επιμελημένο από τον Pharmacist. Καλύπτουμε ευρωπαϊκές startups με αθηναϊκή ενέργεια — δοκίμια, συνεντεύξεις στον δρόμο και σημειώσεις πεδίου."
    },
    events: {
      title: "Εκδηλώσεις"
    },
    subscribe: {
      title: "Εγγραφή"
    }
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem('site-language') || 'en';
    setLanguage(savedLang);

    // Listen for language changes
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  // Helper function to detect language of content
  const detectLanguage = (text) => {
    if (!text) return 'en';
    
    // Simple detection based on Greek characters
    const greekRegex = /[α-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏ]/;
    return greekRegex.test(text) ? 'gr' : 'en';
  };

  return { t, language, detectLanguage };
}
