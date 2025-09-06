import { Sparkles, Newspaper } from "lucide-react";
export default function Nav(){
  return (
    <nav className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-black/30">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400/80 to-pink-500/80 grid place-items-center">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <span className="font-semibold">Tech & the City</span>
          <span className="text-white/50 hidden sm:inline">· curated by The Pharmacist</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a className="hover:text-white" href="/">Home</a>
          <a className="hover:text-white" href="/articles">Articles</a>
          <a className="hover:text-white" href="/street">Street</a>
          <a className="hover:text-white" href="/events">Events</a>
          <a className="hover:text-white" href="/about">About</a>
          <a className="hover:text-white" href="/subscribe">Subscribe</a>
        </div>
        <a className="btn text-sm" href="/subscribe"><Newspaper className="h-4 w-4" /> Subscribe</a>
      </div>
    </nav>
  )
}