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
      <section className="py-1">
        <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-0 leading-tight">
                  WHERE CULTURE MEETS CODE
                </h1>
                <p className="text-xs text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Latest from Athens' cultural & tech scene with an atypical lens.
                </p>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large Featured Article - Left */}
            <div className="lg:col-span-2">
              {featured && (
                <article className="group">
                  <Link href={`/articles/${featured.slug}`} className="block">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                      <div className="aspect-[16/10] overflow-hidden">
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
                      <div className="p-8">
                        <div className="text-gray-300 text-sm mb-4 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(featured.date).toLocaleDateString()}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors mb-6 leading-tight">
                          <TranslatedContent 
                            content={featured.title}
                            originalLanguage="en"
                            targetLanguage={language}
                          />
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                          <TranslatedContent 
                            content={featured.excerpt}
                            originalLanguage="en"
                            targetLanguage={language}
                          />
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center gap-2">
                          {t('home.readArticle')}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </article>
              )}
            </div>

            {/* Smaller Articles - Right */}
            <div className="lg:col-span-1 space-y-6">
              {popularPosts.slice(0, 2).map((post, index) => (
                <article key={post.slug} className="group">
                  <Link href={`/articles/${post.slug}`} className="block">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <div className="aspect-[16/10] overflow-hidden">
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
                    <div className="p-6">
                      <div className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()} • 4 min
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                        <TranslatedContent 
                          content={post.title}
                          originalLanguage="en"
                          targetLanguage={language}
                        />
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
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
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">{t('home.latest')}</h2>
            <Link href="/articles" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              {t('home.viewAll')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {olderPosts.map((post, index) => (
              <article key={post.slug} className="group">
                <Link href={`/articles/${post.slug}`} className="block">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <div className="aspect-[16/10] overflow-hidden">
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
                    <div className="p-6">
                      <div className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()} • 5 min
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                        <TranslatedContent 
                          content={post.title}
                          originalLanguage="en"
                          targetLanguage={language}
                        />
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
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
