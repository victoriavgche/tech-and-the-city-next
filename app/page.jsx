import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { getAllPostsMeta } from "../lib/posts";

export default async function Home(){
  const posts = await getAllPostsMeta();
  // Find "AI στο Ηρώδειο: A Ball to Remember" article
  const herodionAIPost = posts.find(post => post.slug === 'ai-a-ball-to-remember');
  const featured = herodionAIPost || posts[0]; // Herodion AI article or most recent
  const popularPosts = posts.filter(post => post.slug !== featured.slug).slice(0, 4); // Skip the featured article

  return (
    <main className="container py-8 relative z-10">
      {/* Header */}
      <header className="mb-8 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">Culture × Tech, with a pulse.</h1>
        <p className="text-slate-600 max-w-2xl">Essays, on‑feet interviews, and field notes from the European startup scene. No fluff, just signal.</p>
      </header>

      {/* Mobile Layout: Featured Article First */}
      <div className="lg:hidden space-y-6">
        {/* Featured Article - Mobile */}
        {featured && (
          <article className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
            <Link href={`/articles/${featured.slug}`} className="group">
              <div className="space-y-4">
                <div className="aspect-[16/9] rounded-lg overflow-hidden">
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 flex items-center justify-center text-white">
                      <div className="text-center p-8">
                        <div className="text-4xl mb-4">📰</div>
                        <h3 className="text-xl font-bold mb-2">Featured Article</h3>
                        <p className="text-sm opacity-90">{featured.title}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(featured.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* Archive Articles - Mobile */}
        <div className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
          <div className="border-b border-purple-500 pb-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Archive
            </h2>
            <p className="text-xs text-gray-500 mt-1">Recent articles</p>
          </div>
          
          <div className="space-y-4">
            {popularPosts.map((post, index) => (
              <Link key={post.slug} href={`/articles/${post.slug}`} className="group">
                <div className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
                  <div className="w-40 h-36 rounded-lg overflow-hidden flex-shrink-0">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 flex items-center justify-center text-white">
                        <div className="text-3xl">📰</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* View All Articles Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link 
              href="/articles" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              View All Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Three Column */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
        
        {/* Left Sidebar - Archive */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="border-b border-purple-500 pb-2 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Archive
              </h2>
              <p className="text-xs text-gray-500 mt-1">Recent articles</p>
            </div>
            
            <div className="space-y-3">
              {popularPosts.map((post, index) => (
                <Link key={post.slug} href={`/articles/${post.slug}`} className="group">
                  <div className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="w-40 h-36 rounded-lg overflow-hidden flex-shrink-0">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 flex items-center justify-center text-white">
                          <div className="text-3xl">📰</div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* View All Articles Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link 
                href="/articles" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                View All Articles
              </Link>
            </div>
          </div>
        </aside>

        {/* Center - Featured Article */}
        <article className="lg:col-span-6">
          {featured && (
            <Link href={`/articles/${featured.slug}`} className="group">
              <div className="space-y-4">
                <div className="aspect-[16/9] rounded-lg overflow-hidden">
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 flex items-center justify-center text-white">
                      <div className="text-center p-8">
                        <div className="text-4xl mb-4">📰</div>
                        <h3 className="text-xl font-bold mb-2">Featured Article</h3>
                        <p className="text-sm opacity-90">{featured.title}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(featured.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </article>

        {/* Right Sidebar - Empty for now */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
              <p className="text-gray-600 text-sm">
                This space is reserved for future content and features.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}