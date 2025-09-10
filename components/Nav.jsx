import { Sparkles, Newspaper } from "lucide-react";
export default function Nav(){
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl border-b border-cyber-blue/20 bg-cyber-steel/20">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyber-gradient grid place-items-center cyber-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-cyber-silver neon-text">Tech & the City</span>
          <span className="text-cyber-silver/60 hidden sm:inline">· curated by The Pharmacist</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-cyber-silver/80">
          <a className="hover:text-cyber-blue transition-colors duration-200" href="/">Home</a>
          <a className="hover:text-cyber-blue transition-colors duration-200" href="/articles">Articles</a>
          <a className="hover:text-cyber-blue transition-colors duration-200" href="/street">Street</a>
          <a className="hover:text-cyber-blue transition-colors duration-200" href="/events">Events</a>
          <a className="hover:text-cyber-blue transition-colors duration-200" href="/about">About</a>
          <a className="hover:text-cyber-blue transition-colors duration-200" href="/subscribe">Subscribe</a>
        </div>
        <a className="btn text-sm" href="/subscribe"><Newspaper className="h-4 w-4" /> Subscribe</a>
      </div>
    </nav>
  )
}