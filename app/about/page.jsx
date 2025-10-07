'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentLanguage } from '../../lib/translations';

export default function About() {
  const [currentLang, setCurrentLang] = useState('en');
  const [translatedContent, setTranslatedContent] = useState({
    greeting: '',
    intro: '',
    voice: '',
    signature: ''
  });

  const originalContent = {
    greeting: 'Dear gentle readers,',
    intro: "Welcome to a space where Athens' tech and cultural scene take the spotlight, with stories that also reach across Europe. My aim is to explore technology through a social lens, commenting on its impact within society rather than simply reporting events and stories.",
    voice: "Inspired by Bridgerton's Whistledown and blended with my own voice, the Silicon Whisperer was born. If you seek vanilla writing, you may exit now. But if you crave unfiltered words… then enjoy.",
    signature: 'Yours,'
  };

  const greekContent = {
    greeting: 'Αγαπητοί αναγνώστες,',
    intro: 'Σας καλωσορίζω σε έναν χώρο όπου συναντιούνται η τεχνολογία και ο πολιτισμός της Αθήνας, με ιστορίες που φτάνουν μέχρι την Ευρώπη. Στόχος μου δεν είναι απλώς η καταγραφή γεγονότων, αλλά η εξερεύνηση της τεχνολογίας μέσα από ένα κοινωνικό πρίσμα, σχολιάζοντας τον αντίκτυπό της στην κοινωνία.',
    voice: 'Εμπνευσμένη από την Whistledown του Bridgerton και προσθέτοντας τη δική μου φωνή, γεννήθηκε ο χαρακτήρας του Silicon Whisperer. Αν αναζητάς στείρα κείμενα, αυτό δεν είναι το μέρος. Αν όμως επιθυμείς αφιλτράριστα σχόλια, ειλικρίνεια και μια δόση προκλητικής σκέψης… τότε καλή απόλαυση!',
    signature: 'Με εκτίμηση,'
  };

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

  useEffect(() => {
    const translate = async () => {
      if (currentLang === 'en') {
        setTranslatedContent({
          greeting: '',
          intro: '',
          voice: '',
          signature: ''
        });
        return;
      }

      // Use static Greek content instead of translation
      setTranslatedContent(greekContent);
    };

    translate();
  }, [currentLang]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
        
        {/* Header */}
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {currentLang === 'el' ? 'Σχετικά' : 'About'}
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="max-w-none">
            
            <div className="text-gray-300 text-lg leading-relaxed space-y-6 text-justify">
              <p>
                {translatedContent.greeting || originalContent.greeting}
              </p>
              
              <p>
                {translatedContent.intro || originalContent.intro}
              </p>
              
              <p>
                {translatedContent.voice || originalContent.voice}
              </p>
              
              <p className="text-left text-cyan-400 font-medium">
                <em>{translatedContent.signature || originalContent.signature}</em><br />
                <em>the Silicon Whisperer</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

