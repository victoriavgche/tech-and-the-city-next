import { getAllPostsMeta } from "../../lib/posts";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import ClientWrapper from "../../components/ClientWrapper";
import TranslatedContent from "../../components/TranslatedContent";
import { useTranslation } from "../../lib/useTranslation";

// Function to get reading time from post
function getReadingTime(post) {
  if (post.read) {
    return post.read;
  }
  
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
    <main className="min-h-screen bg-slate-900 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <article key={post.slug} className="group">
              <Link href={`/articles/${post.slug}`} className="block">
                <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700 hover:border-slate-600 transition-all duration-300">
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
                    <h2 className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors mb-3 leading-tight">
                      <TranslatedContent 
                        content={post.title}
                        originalLanguage="en"
                        targetLanguage="en"
                      />
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      <TranslatedContent 
                        content={post.excerpt}
                        originalLanguage="en"
                        targetLanguage="en"
                      />
                    </p>
                    
                    {/* Read More Button */}
                    <div className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
          >
            ← Back to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}