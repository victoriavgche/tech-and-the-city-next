import { Sparkles, Github, Linkedin, Instagram } from "lucide-react";
export default function Footer(){
  return (
    <footer className="border-t border-white/10 bg-black/40 mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400/80 to-pink-500/80 grid place-items-center">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="font-semibold">Tech & the City</span>
          </div>
          <p className="text-white/60 text-sm mt-2 max-w-sm">Curated by <b>The Pharmacist</b>. Culture × Tech across Europe, with Athens energy.</p>
        </div>
        <div className="text-sm text-white/70">
          <div className="font-semibold mb-2">Sections</div>
          <ul className="space-y-1">
            <li><a className="hover:text-white" href="/articles">Articles</a></li>
            <li><a className="hover:text-white" href="/street">Street Series</a></li>
            <li><a className="hover:text-white" href="/events">Events</a></li>
          </ul>
        </div>
        <div className="text-sm text-white/70">
          <div className="font-semibold mb-2">Connect</div>
          <div className="flex items-center gap-3">
            <a className="hover:text-white" href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            <a className="hover:text-white" href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            <a className="hover:text-white" href="#" aria-label="GitHub"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-white/50 pb-8">© {new Date().getFullYear()} Tech & the City • Made with attitude</div>
    </footer>
  )
}