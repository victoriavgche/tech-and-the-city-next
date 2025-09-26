'use client';

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import ShareDropdown from "./ShareDropdown";
import ArticleTranslator from "./ArticleTranslator";
import { useState, useEffect } from "react";
import { t, getCurrentLanguage } from "../lib/translations";
import './analytics.js';

export default function ArticlesPageClient({ posts }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [translatedPosts, setTranslatedPosts] = useState({});

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

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
      window.analytics.trackEvent('social_share', {
        platform: platform,
        article: articleSlug,
        source: 'articles_page'
      });
    }
  };

  // Function to get reading time from post
  function getReadingTime(post) {
    const wordsPerMinute = 200;
    const wordCount = post.body ? post.body.split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} ${t('article.readTime', currentLang)}`;
  }

  const handleTranslatePost = (postSlug, translation) => {
    setTranslatedPosts(prev => ({
      ...prev,
      [postSlug]: translation
    }));
  };

  const getPostDisplayData = (post) => {
    const translation = translatedPosts[post.slug];
    if (translation && currentLang !== 'en') {
      return {
        title: translation.title || post.title,
        excerpt: translation.excerpt || post.excerpt
      };
    }
    return {
      title: post.title,
      excerpt: post.excerpt
    };
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
      {posts.map((post) => {
        const displayData = getPostDisplayData(post);
        return (
          <article key={post.slug} className="group">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300">
            <Link 
              href={`/articles/${post.slug}`} 
              className="block"
              onClick={() => handleArticleClick(post.slug)}
            >
              {/* Article Image */}
              <div className="aspect-[16/10] overflow-hidden">
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
            <div className="p-6">
              {/* Date and Reading Time */}
              <div className="text-gray-400 text-sm mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {getReadingTime(post)}
                </div>
              </div>
              
              {/* Title */}
              <div className="flex items-start justify-between mb-3">
                <Link 
                  href={`/articles/${post.slug}`} 
                  className="flex-1"
                  onClick={() => handleArticleClick(post.slug)}
                >
                  <h2 className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors leading-tight">
                    {displayData.title}
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
              >
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {displayData.excerpt}
                </p>
              </Link>
              
              {/* Read More Button */}
              <Link 
                href={`/articles/${post.slug}`}
                onClick={() => handleArticleClick(post.slug)}
              >
                <div className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                  Read Article
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
