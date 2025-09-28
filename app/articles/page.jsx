import { getPublishedPosts } from "../../lib/posts";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ArticlesPageClient from "../../components/ArticlesPageClient";

// Function to get reading time from post
function getReadingTime(post) {
  // Always calculate real reading time based on content
  const wordsPerMinute = 200;
  const wordCount = post.body ? post.body.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

export default async function ArticlesPage() {
  const posts = await getPublishedPosts();
  
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

        {/* Header */}
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Articles</h1>
          </div>
        </header>
        
        {/* Articles Grid */}
        <ArticlesPageClient posts={sortedPosts} />

      </div>
    </main>
  );
}