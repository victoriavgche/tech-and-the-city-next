'use client';

import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp, Clock } from "lucide-react";
import ClientWrapper from "./ClientWrapper";
import ShareDropdown from "./ShareDropdown";
import './analytics.js';

// Function to get reading time from post
function getReadingTime(post) {
  // Always calculate real reading time based on content
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = post.body ? post.body.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

export default function HomePageClient({ posts }) {
  
  const handleArticleClick = (articleSlug, position = 'homepage') => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackClick('article_link', `/articles/${articleSlug}`, {
        position: position,
        article: articleSlug,
        source: 'homepage'
      });
    }
  };

  const handleEventClick = (eventUrl) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackClick('event_link', eventUrl, {
        position: 'homepage',
        source: 'homepage'
      });
    }
  };

  const handleShare = (platform, articleSlug) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackEvent('social_share', {
        platform: platform,
        article: articleSlug,
        source: 'homepage'
      });
    }
  };
  
  // Sort posts by date to ensure most recent is first
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const featured = sortedPosts[0]; // Always most recent article
  const popularPosts = posts.filter(post => post.slug !== featured.slug).slice(0, 2); // Show only 2 for featured section
  const olderPosts = posts.filter(post => post.slug !== featured.slug).slice(2, 5); // Show older articles for Latest section

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      
      {/* Hero Section */}
      <section className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Latest from Athens' cultural & tech scene with an atypical lens
          </h1>
          <p className="text-sm text-gray-400">
            Always unfiltered, never cliché, by the Silicon Whisperer.
          </p>
        </div>
      </section>

      {/* Featured Articles Section */}

      {/* Featured Articles Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Large Featured Article - Left */}
            <div className="lg:col-span-2">
              {featured && (
                <article className="group">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <Link 
                      href={`/articles/${featured.slug}`} 
                      className="block"
                      onClick={() => handleArticleClick(featured.slug, 'featured')}
                    >
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
                    </Link>
                    <div className="p-8">
                      <div className="text-gray-300 text-sm mb-6 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(featured.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {getReadingTime(featured)}
                        </div>
                      </div>
                      <div className="flex items-start justify-between mb-4">
                        <Link 
                          href={`/articles/${featured.slug}`} 
                          className="flex-1 text-center"
                          onClick={() => handleArticleClick(featured.slug, 'featured_title')}
                        >
                          <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all leading-tight">
                            {featured.title}
                          </h2>
                        </Link>
                        <div className="ml-4 flex-shrink-0">
                          <ShareDropdown 
                            title={featured.title}
                            url={`${typeof window !== 'undefined' ? window.location.origin : 'https://techandthecity.com'}/articles/${featured.slug}`}
                            excerpt={featured.excerpt}
                          />
                        </div>
                      </div>
                      <Link 
                        href={`/articles/${featured.slug}`}
                        onClick={() => handleArticleClick(featured.slug, 'featured_excerpt')}
                      >
                        <p className="text-base text-gray-300 leading-relaxed">
                          {featured.excerpt}
                        </p>
                      </Link>
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* Smaller Articles - Right */}
            <div className="lg:col-span-1 space-y-6">
              {popularPosts.slice(0, 2).map((post, index) => (
                <article key={post.slug} className="group">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
                    <Link 
                      href={`/articles/${post.slug}`} 
                      className="block"
                      onClick={() => handleArticleClick(post.slug, 'popular')}
                    >
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
                    </Link>
                    <div className="p-3">
                      <div className="text-gray-400 text-sm mb-3 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                            {getReadingTime(post)}
                        </div>
                      </div>
                      <div className="flex items-start justify-between mb-3">
                        <Link 
                          href={`/articles/${post.slug}`} 
                          className="flex-1 text-center"
                          onClick={() => handleArticleClick(post.slug, 'popular_title')}
                        >
                          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all leading-tight">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="ml-2 flex-shrink-0">
                          <ShareDropdown 
                            title={post.title}
                            url={`${typeof window !== 'undefined' ? window.location.origin : 'https://techandthecity.com'}/articles/${post.slug}`}
                            excerpt={post.excerpt}
                          />
                        </div>
                      </div>
                      <Link 
                        href={`/articles/${post.slug}`}
                        onClick={() => handleArticleClick(post.slug, 'popular_excerpt')}
                      >
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Latest Articles</h2>
            <Link href="/articles" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {olderPosts.map((post, index) => (
              <article key={post.slug} className="group">
                <Link 
                  href={`/articles/${post.slug}`} 
                  className="block"
                  onClick={() => handleArticleClick(post.slug, 'latest')}
                >
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
                    <div className="p-3">
                      <div className="text-gray-400 text-sm mb-3 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                            {getReadingTime(post)}
                        </div>
                      </div>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all leading-tight flex-1 text-center">
                          {post.title}
                        </h3>
                        <div className="ml-2 flex-shrink-0">
                          <ShareDropdown 
                            title={post.title}
                            url={`${typeof window !== 'undefined' ? window.location.origin : 'https://techandthecity.com'}/articles/${post.slug}`}
                            excerpt={post.excerpt}
                          />
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {post.excerpt}
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
