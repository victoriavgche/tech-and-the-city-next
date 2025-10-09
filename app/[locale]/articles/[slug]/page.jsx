import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticlesMeta } from "../../../../lib/articles";

export async function generateStaticParams(){
  const posts = await getAllArticlesMeta();
  return posts.map(p=>({ slug: p.slug }));
}

export async function generateMetadata({ params }){
  const post = await getArticleBySlug(params.slug);
  if(!post) return { title: "Article — Tech & the City" };
  return { title: `${post.title} — Tech & the City`, description: post.excerpt };
}

export default async function Article({ params }){
  const post = await getArticleBySlug(params.slug);
  if(!post) return notFound();

  return (
    <main className="container py-12">
      <article className="prose max-w-3xl">
        <div className="text-white/60 text-sm">{new Date(post.date).toLocaleDateString()} • {post.read ?? "5 min"}</div>
        <h1 className="text-4xl font-semibold mt-1">{post.title}</h1>
        <p className="text-white/70">{post.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  )
}