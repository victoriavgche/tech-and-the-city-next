import Link from "next/link";
import { getAllPostsMeta } from "../../lib/posts";

export default async function ArticlesPage() {
  const posts = await getAllPostsMeta();

  return (
    <main className="container py-8">
      <header className="mb-8 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">Articles</h1>
        <p className="text-slate-600 max-w-2xl">All our essays, interviews, and field notes from the European startup scene.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/articles/${post.slug}`} className="group">
            <article className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
              <div className="aspect-[16/9] bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 rounded-lg mb-4 flex items-center justify-center text-white">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">📰</div>
                  <p className="text-sm opacity-90 font-semibold">Article</p>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/admin/edit/${post.slug}`}
                    className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
