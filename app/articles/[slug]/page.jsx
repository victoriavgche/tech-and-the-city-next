'use client';

import Link from "next/link";
import SocialShare from "../../../components/SocialShare";
import ArticleTranslator from "../../../components/ArticleTranslator";
import { getCurrentLanguage, translateText, detectLanguage } from "../../../lib/translations";
import { useState, useEffect } from "react";


export default function ArticlePage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedExcerpt, setTranslatedExcerpt] = useState('');
  const [originalLang, setOriginalLang] = useState('en');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);
        if (response.ok) {
          const postData = await response.json();
          setPost(postData);
          // Detect original language from content (more reliable)
          const detected = detectLanguage(postData.content || postData.title);
          setOriginalLang(detected);
        } else {
          // Handle not found
          window.location.href = '/404';
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        window.location.href = '/404';
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    setCurrentLang(getCurrentLanguage());
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [params.slug]);

  // Translate title and excerpt when language changes
  useEffect(() => {
    const translateHeader = async () => {
      if (!post || currentLang === originalLang) {
        setTranslatedTitle('');
        setTranslatedExcerpt('');
        return;
      }

      try {
        const [title, excerpt] = await Promise.all([
          translateText(post.title, currentLang, originalLang),
          translateText(post.excerpt, currentLang, originalLang)
        ]);
        setTranslatedTitle(title);
        setTranslatedExcerpt(excerpt);
      } catch (error) {
        console.error('Error translating header:', error);
      }
    };

    translateHeader();
  }, [currentLang, originalLang, post]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center text-white">Loading article...</div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center text-white">Article not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back button */}
        <div className="flex justify-start items-center mb-8">
          <Link 
            href="/articles" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-8 bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700">
          <h1 className="text-xl md:text-2xl font-semibold text-cyan-400 mb-4 leading-tight text-center">
            {translatedTitle || post.title}
          </h1>
          <p className="text-gray-300 text-lg mb-4" style={{ textAlign: 'justify' }}>
            {translatedExcerpt || post.excerpt}
          </p>
          <div className="text-sm text-gray-400 text-right">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </header>

        {/* Article image */}
        {post.image && (
          <div className="mb-8 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Social Share */}
        <SocialShare 
          title={post.title}
          url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://techandthecity.com'}/articles/${params.slug}`}
          excerpt={post.excerpt}
        />

        {/* Article content with DeepL translation */}
        <article className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 text-justify">
          <ArticleTranslator 
            title={post.title}
            excerpt={post.excerpt}
            content={post.content}
          />
        </article>
      </div>
    </main>
  );
}
