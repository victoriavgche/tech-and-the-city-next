'use client';

import { Github, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";

export default function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-700 bg-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Mobile Layout - Sections left, Connect right */}
        <div className="md:hidden">
          <div className="flex justify-between items-start">
            {/* Sections - Left */}
            <div className="text-sm text-gray-300 text-left">
              <div className="font-semibold text-white mb-3 text-lg">{t('footer.sections')}</div>
              <ul className="space-y-2">
                <li><a className="hover:text-blue-400 transition-colors text-base" href="/about">{t('nav.about')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors text-base" href="/articles">{t('nav.articles')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors text-base" href="/events">{t('nav.events')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors text-base" href="/contact">{t('nav.contact')}</a></li>
              </ul>
            </div>
            
            {/* Connect - Right */}
            <div className="text-sm text-gray-300 text-right">
              <div className="font-semibold text-white mb-3 text-lg">{t('footer.connect')}</div>
              <div className="flex items-center justify-end gap-3">
                <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-8 w-8" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-8 w-8" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="text-white font-bold text-xl">𝕏</span></a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout - Sections left, Connect right */}
        <div className="hidden md:flex justify-between items-start">
          {/* Sections - Left */}
          <div className="text-base text-gray-300 text-left">
            <div className="font-semibold text-white mb-4 text-xl">{t('footer.sections')}</div>
            <ul className="space-y-3">
              <li><a className="hover:text-blue-400 transition-colors text-lg" href="/about">{t('nav.about')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors text-lg" href="/articles">{t('nav.articles')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors text-lg" href="/events">{t('nav.events')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors text-lg" href="/contact">{t('nav.contact')}</a></li>
            </ul>
          </div>
          
          {/* Connect - Right */}
          <div className="text-base text-gray-300 text-right">
            <div className="font-semibold text-white mb-4 text-xl">{t('footer.connect')}</div>
            <div className="flex items-center justify-end gap-6">
              <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-10 w-10" /></a>
              <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-10 w-10" /></a>
              <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="text-white font-bold text-2xl">𝕏</span></a>
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