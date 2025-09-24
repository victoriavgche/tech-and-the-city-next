import { getAllPostsMeta } from "../../lib/posts";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import ClientWrapper from "../../components/ClientWrapper";
import ShareDropdown from "../../components/ShareDropdown";

// Function to get reading time from post
function getReadingTime(post) {
  // Always calculate real reading time based on content
  const wordsPerMinute = 200;
  const wordCount = post.body ? post.body.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

export default async function ArticlesPage() {
  const posts = await getAllPostsMeta();
  
  // Sort posts by date (most recent first)
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-base font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <article key={post.slug} className="group">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300">
                <Link href={`/articles/${post.slug}`} className="block">
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
                    <Link href={`/articles/${post.slug}`} className="flex-1">
                      <h2 className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors leading-tight">
                        {post.title}
                      </h2>
                    </Link>
                    <div className="ml-2 flex-shrink-0">
                      <ShareDropdown 
                        title={post.title}
                        url={`${typeof window !== 'undefined' ? window.location.origin : 'https://techandthecity.com'}/articles/${post.slug}`}
                        excerpt={post.excerpt}
                      />
                    </div>
                  </div>
                  
                  {/* Excerpt */}
                  <Link href={`/articles/${post.slug}`}>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </Link>
                  
                  {/* Read More Button */}
                  <Link href={`/articles/${post.slug}`}>
                    <div className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}