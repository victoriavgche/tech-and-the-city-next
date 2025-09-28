import { getAllPostsMeta, getPostBySlug } from "../../../lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClientWrapper from "../../../components/ClientWrapper";
import SocialShare from "../../../components/SocialShare";

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
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back button */}
        <div className="flex justify-start items-center mb-8">
          <Link 
            href="/articles" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Articles
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-8 bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700">
          <h1 className="text-xl md:text-2xl font-semibold text-cyan-400 mb-4 leading-tight text-center">
            {post.title}
          </h1>
          <p className="text-gray-300 text-lg mb-4 text-justify">
            <ClientWrapper content={post.excerpt} />
          </p>
          <div className="text-sm text-gray-400 text-right">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </header>

        {/* Article image */}
        {post.image && (
          <div className="mb-8 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Social Share */}
        <SocialShare 
          title={post.title}
          url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://techandthecity.com'}/articles/${params.slug}`}
          excerpt={post.excerpt}
        />

        {/* Article content */}
        <article className="bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700 text-justify">
          <div className="prose prose-lg max-w-none prose-invert">
            <ClientWrapper content={post.content} />
          </div>
        </article>
      </div>
    </main>
  );
}
