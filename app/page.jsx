import Link from "next/link";
import { Calendar, ArrowRight, Play } from "lucide-react";
import { getAllPostsMeta } from "../lib/posts";

export default async function Home(){
  const posts = await getAllPostsMeta();
  const featured = posts[0];

  const videos = [
    {
      id: 1,
      title: "Hero Video 1",
      description: "First hero video showcasing tech culture",
      filename: "hero1.mp4.mp4",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Hero Video 2", 
      description: "Second hero video exploring startup scenes",
      filename: "hero2.mp4.mp4",
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Hero Video 3",
      description: "Third hero video featuring field notes",
      filename: "hero3.mp4.mp4", 
      date: "2024-01-25"
    }
  ];

  // Create alternating layout: video -> content -> video -> content -> video -> content
  const layoutItems = [];
  
  // Add header
  layoutItems.push({ type: 'header' });
  
  // Add first video
  layoutItems.push({ type: 'video', data: videos[0] });
  
  // Add featured content
  layoutItems.push({ type: 'featured', data: featured });
  
  // Add second video
  layoutItems.push({ type: 'video', data: videos[1] });
  
  // Add latest articles
  layoutItems.push({ type: 'latest', data: posts });
  
  // Add third video
  layoutItems.push({ type: 'video', data: videos[2] });

  return (
    <main className="container py-12">
      {layoutItems.map((item, index) => {
        switch (item.type) {
          case 'header':
            return (
              <header key={index} className="mb-10">
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight neon-text">Culture × Tech, with a pulse.</h1>
                <p className="mt-4 max-w-2xl text-cyber-silver/70">Essays, on‑feet interviews, and field notes from the European startup scene. No fluff, just signal.</p>
              </header>
            );
          
          case 'video':
            return (
              <section key={index} className="mb-12">
                <div className="relative aspect-video bg-cyber-gradient rounded-lg overflow-hidden cyber-glow">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src={`/videos/${item.data.filename}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 group-hover:from-cyber-blue/10 group-hover:to-cyber-purple/10 transition-all duration-300"></div>
                </div>
              </section>
            );
          
          case 'featured':
            return item.data && (
              <section key={index} className="mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card overflow-hidden">
                    <div className="h-40 md:h-56 w-full bg-cyber-gradient" />
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-cyber-silver/60">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.data.date).toLocaleDateString()}</span>
                      </div>
                      <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-cyber-silver">{item.data.title}</h2>
                      <p className="mt-2 text-cyber-silver/70 max-w-2xl">{item.data.excerpt}</p>
                      <Link className="btn mt-4" href={`/articles/${item.data.slug}`}>Read article <ArrowRight className="h-4 w-4"/></Link>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {item.data && posts.slice(1,3).map(p=>(
                      <Link key={p.slug} className="card p-5 hover:border-cyber-blue/40" href={`/articles/${p.slug}`}>
                        <div className="text-xs text-cyber-silver/60">{new Date(p.date).toLocaleDateString()} • {p.read ?? "5 min"}</div>
                        <div className="mt-2 text-lg font-semibold text-cyber-silver">{p.title}</div>
                        <div className="text-cyber-silver/70">{p.excerpt}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          
          case 'latest':
            return (
              <section key={index} className="mb-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold neon-text">Latest</h3>
                  <Link href="/articles" className="text-cyber-silver/70 hover:text-cyber-blue transition-colors duration-200">View all →</Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {item.data.slice(0,6).map(p=>(
                    <Link key={p.slug} className="card p-5 hover:border-cyber-blue/40" href={`/articles/${p.slug}`}>
                      <div className="text-xs text-cyber-silver/60">{new Date(p.date).toLocaleDateString()} • {p.read ?? "5 min"}</div>
                      <div className="mt-2 text-lg font-semibold text-cyber-silver">{p.title}</div>
                      <div className="text-cyber-silver/70 line-clamp-2">{p.excerpt}</div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          
          default:
            return null;
        }
      })}
    </main>
  )
}