import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { getAllPostsMeta } from "../lib/posts";

export default async function Home(){
  const posts = await getAllPostsMeta();
  const featured = posts[0];

  return (
    <main className="container py-12">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Culture × Tech, with a pulse.</h1>
        <p className="mt-4 max-w-2xl text-white/70">Essays, on‑feet interviews, and field notes from the European startup scene. No fluff, just signal.</p>
      </header>

      {featured && (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="card overflow-hidden">
            <div className="h-40 md:h-56 w-full bg-[radial-gradient(ellipse_at_top_left,rgba(148,163,184,0.35),transparent),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.45),transparent)]" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Calendar className="h-4 w-4" />
                <span>{new Date(featured.date).toLocaleDateString()}</span>
              </div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold">{featured.title}</h2>
              <p className="mt-2 text-white/70 max-w-2xl">{featured.excerpt}</p>
              <Link className="btn mt-4" href={`/articles/${featured.slug}`}>Read article <ArrowRight className="h-4 w-4"/></Link>
            </div>
          </div>
          <div className="grid gap-4">
            {posts.slice(1,3).map(p=>(
              <Link key={p.slug} className="card p-5 hover:border-white/20" href={`/articles/${p.slug}`}>
                <div className="text-xs text-white/60">{new Date(p.date).toLocaleDateString()} • {p.read ?? "5 min"}</div>
                <div className="mt-2 text-lg font-semibold">{p.title}</div>
                <div className="text-white/70">{p.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Latest</h3>
          <Link href="/articles" className="text-white/70 hover:text-white">View all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {posts.slice(0,6).map(p=>(
            <Link key={p.slug} className="card p-5 hover:border-white/20" href={`/articles/${p.slug}`}>
              <div className="text-xs text-white/60">{new Date(p.date).toLocaleDateString()} • {p.read ?? "5 min"}</div>
              <div className="mt-2 text-lg font-semibold">{p.title}</div>
              <div className="text-white/70 line-clamp-2">{p.excerpt}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}