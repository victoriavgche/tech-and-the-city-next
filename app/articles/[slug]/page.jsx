import { getAllPostsMeta, getPostBySlug } from "../../../lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button and Edit button */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/articles" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Articles
          </Link>
          <Link 
            href={`/admin/edit/${params.slug}`}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ✏️ Edit Article
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            {post.excerpt}
          </p>
          <div className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </header>

        {/* Article image */}
        {post.image && (
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 flex items-center justify-center text-white">
                <div className="text-center p-8">
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-xl font-bold mb-2">Ηρώδειο - Νυχτερινή Παράσταση</h3>
                  <p className="text-sm opacity-90">
                    Αρχαίο αμφιθέατρο με σύγχρονες προβολές<br/>
                    Μπλε, μοβ και πορτοκαλί φωτισμός
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article content */}
        <article className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-200">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>
    </main>
  );
}
