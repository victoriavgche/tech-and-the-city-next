import { getAllPostsMeta } from "../lib/posts";

export default async function sitemap() {
  const base = process.env.SITE_URL || "https://example.com";
  const posts = await getAllPostsMeta();
  const routes = ["/","/articles","/street","/events","/about","/subscribe"]
    .map((p)=>({ url: base + p, lastModified: new Date().toISOString() }));
  const blog = posts.map(p=>({ url: `${base}/articles/${p.slug}`, lastModified: p.date }));
  return [...routes, ...blog];
}