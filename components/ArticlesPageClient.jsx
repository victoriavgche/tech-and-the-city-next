'use client';

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import ShareDropdown from "./ShareDropdown";
import { useState, useEffect } from "react";
import { getCurrentLanguage, translateText, detectLanguage } from '../lib/translations';
import './analytics.js';

export default function ArticlesPageClient({ posts }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [translatedPosts, setTranslatedPosts] = useState({});

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

  // Translate posts when language changes
  useEffect(() => {
    const translatePosts = async () => {
      if (!posts || posts.length === 0) return;
      
      const originalLang = detectLanguage(posts[0]?.body || posts[0]?.title || '');
      
      if (currentLang === originalLang) {
        setTranslatedPosts({});
        return;
      }

      const translations = {};
      
      for (const post of posts) {
        try {
          const [title, excerpt] = await Promise.all([
            translateText(post.title, currentLang, originalLang),
            translateText(post.excerpt, currentLang, originalLang)
          ]);
          translations[post.slug] = { title, excerpt };
        } catch (error) {
          console.error(`Translation error for ${post.slug}:`, error);
        }
      }
      
      setTranslatedPosts(translations);
    };

    translatePosts();
  }, [currentLang, posts]);

  const handleArticleClick = (articleSlug) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackClick('article_link', `/articles/${articleSlug}`, {
        position: 'articles_page',
        article: articleSlug
      });
    }
  };

  const handleShare = (platform, articleSlug) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackEvent("social_share", platform, {
        article: articleSlug
      });
    }
  };

  // Function to get reading time from post
  function getReadingTime(post, lang = 'en') {
    const wordsPerMinute = 200;
    const wordCount = post.body ? post.body.split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} ${lang === 'el' ? 'λεπ' : 'min'}`;
  }


  return (
    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {posts.map((post) => {
        return (
          <article key={post.slug} className="group">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300 h-full flex flex-col">
            <Link 
              href={`/articles/${post.slug}`} 
              className="block"
              onClick={() => handleArticleClick(post.slug)}
            >
              {/* Article Image */}
              <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center">
                    <div className="text-white text-4xl">📰</div>
                  </div>
                )}
              </div>
            </Link>
            
            {/* Article Content */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Date and Reading Time */}
              <div className="text-gray-400 text-sm mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {getReadingTime(post, currentLang)}
                </div>
              </div>
              
              {/* Title */}
              <div className="flex items-start justify-between mb-4">
                <Link 
                  href={`/articles/${post.slug}`} 
                  className="flex-1"
                  onClick={() => handleArticleClick(post.slug)}
                >
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all leading-tight">
                    {translatedPosts[post.slug]?.title || post.title}
                  </h2>
                </Link>
                <ShareDropdown 
                  url={`${typeof window !== 'undefined' ? window.location.origin : 'https://techandthecity.com'}/articles/${post.slug}`}
                  title={post.title}
                  onShare={(platform) => handleShare(platform, post.slug)}
                />
              </div>
              
              {/* Excerpt */}
              <Link 
                href={`/articles/${post.slug}`}
                onClick={() => handleArticleClick(post.slug)}
                className="flex-grow"
              >
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {translatedPosts[post.slug]?.excerpt || post.excerpt}
                </p>
              </Link>
              
              {/* Read More Button */}
              <Link 
                href={`/articles/${post.slug}`}
                onClick={() => handleArticleClick(post.slug)}
                className="mt-auto"
              >
                <div className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                  {currentLang === 'el' ? 'Διάβασε το Άρθρο' : 'Read Article'}
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
          </article>
        );
      })}
    </div>
  );
}
