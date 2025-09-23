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
            <div className="text-xs text-gray-300 text-left">
              <div className="font-semibold text-white mb-2">{t('footer.sections')}</div>
              <ul className="space-y-1">
                <li><a className="hover:text-blue-400 transition-colors" href="/about">{t('nav.about')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="/articles">{t('nav.articles')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="/events">{t('nav.events')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="/contact">{t('nav.contact')}</a></li>
              </ul>
            </div>
            
            {/* Connect - Right */}
            <div className="text-xs text-gray-300 text-right">
              <div className="font-semibold text-white mb-2">{t('footer.connect')}</div>
              <div className="flex items-center justify-end gap-2">
                <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="text-white font-bold text-sm">𝕏</span></a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout - Sections left, Connect right */}
        <div className="hidden md:flex justify-between items-start">
          {/* Sections - Left */}
          <div className="text-sm text-gray-300 text-left">
            <div className="font-semibold text-white mb-3">{t('footer.sections')}</div>
            <ul className="space-y-2">
              <li><a className="hover:text-blue-400 transition-colors" href="/about">{t('nav.about')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors" href="/articles">{t('nav.articles')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors" href="/events">{t('nav.events')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors" href="/contact">{t('nav.contact')}</a></li>
            </ul>
          </div>
          
          {/* Connect - Right */}
          <div className="text-sm text-gray-300 text-right">
            <div className="font-semibold text-white mb-3">{t('footer.connect')}</div>
            <div className="flex items-center justify-end gap-4">
              <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
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