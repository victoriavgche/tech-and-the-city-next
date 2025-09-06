import Link from "next/link";
import { getAllPostsMeta } from "../../lib/posts";

export const metadata = { title: "Articles — Tech & the City" };

export default async function Articles(){
  const posts = await getAllPostsMeta();
  const tags = Array.from(new Set(posts.flatMap(p=>p.tags || [])));

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold mb-4">Articles</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(t=>(<span key={t} className="pill">{t}</span>))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {posts.map(p=>(
          <Link key={p.slug} className="card p-5 hover:border-white/20" href={`/articles/${p.slug}`}>
            <div className="text-xs text-white/60">{new Date(p.date).toLocaleDateString()}</div>
            <div className="mt-2 text-lg font-semibold">{p.title}</div>
            <div className="text-white/70 line-clamp-2">{p.excerpt}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}