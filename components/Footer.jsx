import { Sparkles, Github, Linkedin, Instagram, Twitter } from "lucide-react";
export default function Footer(){
  return (
    <footer className="border-t border-gray-700 bg-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-white font-bold italic text-xl tracking-wide">
              T&C
            </div>
            <span className="font-semibold text-white">Tech & the City</span>
          </div>
          <p className="text-gray-300 text-sm max-w-sm">Curated by <b>The Pharmacist</b>. Culture × Tech across Europe, with Athens energy.</p>
        </div>
        <div className="text-sm text-gray-300">
          <div className="font-semibold text-white mb-3">Sections</div>
          <ul className="space-y-2">
            <li><a className="hover:text-blue-400 transition-colors" href="/articles">Articles</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="/events">Events</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="/about">About</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="/contact">Contact</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="/admin">Admin</a></li>
          </ul>
        </div>
        <div className="text-sm text-gray-300">
          <div className="font-semibold text-white mb-3">Connect</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            <a className="hover:text-blue-400 transition-colors" href="https://linkedin.com/company/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><Twitter className="h-5 w-5" /></a>
            <a className="hover:text-blue-400 transition-colors" href="https://github.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Tech & the City • Made with attitude
        </div>
      </div>
    </footer>
  )
}