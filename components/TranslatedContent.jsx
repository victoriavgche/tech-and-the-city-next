'use client';

import { useState, useEffect } from 'react';

export default function TranslatedContent({ 
  content, 
  originalLanguage = 'en', 
  targetLanguage = 'en',
  className = '',
  skipTranslation = false 
}) {
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      // If source and target are the same, keep original
      if (originalLanguage === targetLanguage) {
        setTranslatedContent(content);
        return;
      }

      // Skip translation for very short texts or titles
      if (skipTranslation || content.length < 10) {
        setTranslatedContent(content);
        return;
      }

      // Fallback translations for common phrases
      const fallbackTranslations = {
        'WHERE CULTURE MEETS CODE': 'ΟΠΟΥ Η ΚΟΥΛΤΟΥΡΑ ΣΥΝΑΝΤΑ ΤΟΝ ΚΩΔΙΚΑ',
        'No buzzwords, just vibes.': 'Χωρίς φλύαρες, μόνο ατμόσφαιρα.',
        'Read article': 'Διάβασε το άρθρο',
        'View all': 'Δες όλα',
        'Latest': 'Τελευταία',
        'The Bridgerton of AI: Who\'s the Season\'s Diamond?': 'Το Bridgerton της AI: Ποιος είναι το Διαμάντι της Σεζόν;',
        'Agentic AI, GenAI, and the courtship of capital: why \'useful\' beats \'novel\' in 2025.': 'Agentic AI, GenAI, και η φλερτ του κεφαλαίου: γιατί το \'χρήσιμο\' νικά το \'καινοτόμο\' το 2025.',
        'From Raves to Runways: Why Nightlife Is Europe\'s Hidden Innovation Lab': 'Από τα Raves στα Runways: Γιατί η Νυχτερινή Ζωή είναι το Κρυφό Εργαστήριο Καινοτομίας της Ευρώπης',
        'Culture-first go-to-market: how club scenes shape adoption curves for apps, fashion-tech and creator tools.': 'Κουλτούρα-πρώτα go-to-market: πώς οι club σκηνές διαμορφώνουν καμπύλες υιοθέτησης για εφαρμογές, fashion-tech και εργαλεία δημιουργών.',
        'BioTech x AI: The New European Advantage': 'BioTech x AI: Το Νέο Ευρωπαϊκό Πλεονέκτημα',
        'Where data is scarce and trust is mandatory, EU founders can actually move faster—if they design with regulators.': 'Όπου τα δεδομένα είναι σπάνια και η εμπιστοσύνη είναι υποχρεωτική, οι Ευρωπαίοι ιδρυτές μπορούν πραγματικά να κινηθούν πιο γρήγορα—αν σχεδιάσουν με τους ρυθμιστές.',
        'Last week, Athens turned into a cyberpunk dreamscape as we took over the iconic Ciné Paris for a one-of-a-kind evening where neon met the Parthenon and AI met the silver screen.': 'Την περασμένη εβδομάδα, η Αθήνα μεταμορφώθηκε σε ένα cyberpunk ονειρικό τοπίο καθώς καταλάβαμε το εμβληματικό Ciné Paris για μια μοναδική βραδιά όπου το neon συνάντησε τον Παρθενώνα και η AI συνάντησε την ασημένια οθόνη.',
        'AI στο Ηρώδειο: A Ball to Remember': 'AI στο Ηρώδειο: A Ball to Remember',
        'From ancient amphitheaters to modern AI: how Athens is becoming Europe\'s unexpected tech capital.': 'Από τα αρχαία αμφιθέατρα στη σύγχρονη AI: πώς η Αθήνα γίνεται η απροσδόκητη τεχνολογική πρωτεύουσα της Ευρώπης.',
        'The Future of Work: Remote vs Hybrid vs Office': 'The Future of Work: Remote vs Hybrid vs Office',
        'Exploring the new workplace paradigms and what they mean for European startups.': 'Εξερευνώντας τα νέα παραδείγματα χώρου εργασίας και τι σημαίνουν για τις ευρωπαϊκές startups.',
        'Sustainable Tech: Green Innovation in Europe': 'Βιώσιμη Τεχνολογία: Πράσινη Καινοτομία στην Ευρώπη',
        'How European tech companies are leading the charge in environmental sustainability.': 'Πώς οι ευρωπαϊκές τεχνολογικές εταιρείες ηγούνται της φόρτισης στην περιβαλλοντική βιωσιμότητα.',
        'The Rise of European Unicorns': 'The Rise of European Unicorns',
        'A deep dive into Europe\'s most successful startups and what makes them unique.': 'Μια βαθιά κατάδυση στις πιο επιτυχημένες startups της Ευρώπης και τι τις κάνει μοναδικές.',
        'Tech Meets Culture: The Athens Scene': 'Tech Meets Culture: The Athens Scene',
        'Discovering how Athens is becoming a hub for tech innovation and cultural exchange.': 'Ανακαλύπτοντας πώς η Αθήνα γίνεται κέντρο τεχνολογικής καινοτομίας και πολιτιστικής ανταλλαγής.'
      };
      
      if (fallbackTranslations[content]) {
        setTranslatedContent(fallbackTranslations[content]);
        return;
      }

      setIsTranslating(true);
      
      try {
        // Use Google Translate API
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${originalLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(content)}`
        );
        
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          setTranslatedContent(data[0][0][0]);
        } else {
          setTranslatedContent(content);
        }
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedContent(content);
      } finally {
        setIsTranslating(false);
      }
    };

    performTranslation();
  }, [content, originalLanguage, targetLanguage, skipTranslation]);

  if (isTranslating) {
    return (
      <div className={`${className} opacity-70`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">Translating...</div>
      </div>
    );
  }

  return (
    <span className={className}>
      {typeof translatedContent === 'string' && translatedContent.includes('<') ? (
        <span dangerouslySetInnerHTML={{ __html: translatedContent }} />
      ) : (
        <span>{translatedContent}</span>
      )}
    </span>
  );
}
