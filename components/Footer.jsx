'use client';

import { Github, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";

export default function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-700 bg-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Mobile Layout - Connect only, left positioned */}
        <div className="md:hidden">
          <div className="flex justify-start items-start">
            {/* Connect - Left */}
            <div className="text-xs text-gray-300 text-left">
              <div className="font-semibold text-white mb-2 text-sm">{t('footer.connect')}</div>
              <div className="flex items-center gap-2">
                <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="text-white font-bold text-sm">𝕏</span></a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout - Connect only, left positioned */}
        <div className="hidden md:flex justify-start items-start">
          {/* Connect - Left */}
          <div className="text-sm text-gray-300 text-left">
            <div className="font-semibold text-white mb-3 text-base">{t('footer.connect')}</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-7 w-7" /></a>
              <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-7 w-7" /></a>
              <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="text-white font-bold text-lg">𝕏</span></a>
            </div>
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