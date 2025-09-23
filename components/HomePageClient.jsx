'use client';

import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import ClientWrapper from "./ClientWrapper";
import TranslatedContent from "./TranslatedContent";
import { useTranslation } from "../lib/useTranslation";

export default function HomePageClient({ posts }) {
  const { t, language } = useTranslation();
  
  // Find "AI στο Ηρώδειο: A Ball to Remember" article
  const herodionAIPost = posts.find(post => post.slug === 'ai-a-ball-to-remember');
  const featured = herodionAIPost || posts[0]; // Herodion AI article or most recent
  const popularPosts = posts.filter(post => post.slug !== featured.slug).slice(0, 2); // Show only 2 for featured section
  const olderPosts = posts.filter(post => post.slug !== featured.slug).slice(2, 5); // Show older articles for Latest section

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      {/* Hero Section */}
      <section className="py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                  Latest from Athens' cultural & tech scene with an atypical lens
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  No buzzwords. Just vibes, by Whistledown.
                </p>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Large Featured Article - Left */}
            <div className="lg:col-span-2">
              {featured && (
                <article className="group">
                  <Link href={`/articles/${featured.slug}`} className="block">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/20">
                      <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                        {featured.image ? (
                          <img
                            src={featured.image}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900"></div>
                        )}
                      </div>
                      <div className="p-4 sm:p-6 md:p-8">
                        <div className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {new Date(featured.date).toLocaleDateString()}
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors mb-4 sm:mb-6 leading-tight">
                          <TranslatedContent 
                            content={featured.title}
                            originalLanguage="en"
                            targetLanguage={language}
                          />
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                          <TranslatedContent 
                            content={featured.excerpt}
                            originalLanguage="en"
                            targetLanguage={language}
                          />
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center gap-2 text-sm sm:text-base">
                          {t('home.readArticle')}
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </article>
              )}
            </div>

            {/* Smaller Articles - Right */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {popularPosts.slice(0, 2).map((post, index) => (
                <article key={post.slug} className="group">
                  <Link href={`/articles/${post.slug}`} className="block">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900"></div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()} • 4 min
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2 sm:mb-3 leading-tight">
                        <TranslatedContent 
                          content={post.title}
                          originalLanguage="en"
                          targetLanguage={language}
                        />
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        <TranslatedContent 
                          content={post.excerpt}
                          originalLanguage="en"
                          targetLanguage={language}
                        />
                      </p>
                    </div>
                  </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('home.latest')}</h2>
            <Link href="/articles" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm sm:text-base">
              {t('home.viewAll')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {olderPosts.map((post, index) => (
              <article key={post.slug} className="group">
                <Link href={`/articles/${post.slug}`} className="block">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900"></div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()} • 5 min
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2 sm:mb-3 leading-tight">
                        <TranslatedContent 
                          content={post.title}
                          originalLanguage="en"
                          targetLanguage={language}
                        />
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        <TranslatedContent 
                          content={post.excerpt}
                          originalLanguage="en"
                          targetLanguage={language}
                        />
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
