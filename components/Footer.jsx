'use client';

import { Github, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";

export default function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-700 bg-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Mobile Layout - Evenly Spaced */}
        <div className="md:hidden">
          {/* Logo, Sections, and Connect in same line with equal spacing */}
          <div className="flex items-start justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 flex-1">
              <div className="relative bg-gray-800 p-1.5 w-8 h-6">
                {/* Frame lines - uniform thickness */}
                <div className="absolute inset-0">
                  {/* Top line - full width */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-white"></div>
                  {/* Right line - full height */}
                  <div className="absolute top-0 right-0 w-0.5 h-full bg-white"></div>
                  {/* Bottom line - only right part, no left part */}
                  <div className="absolute bottom-0 right-0 w-3 h-0.5 bg-white"></div>
                  {/* Left line - only top part, no bottom part */}
                  <div className="absolute top-0 left-0 w-0.5 h-3 bg-white"></div>
                  {/* Bottom-left corner is completely missing */}
                </div>
                {/* T&C Text */}
                <div className="text-white font-bold text-xs tracking-wide relative z-10 flex items-center justify-center h-full">
                  T&C
                </div>
              </div>
              {/* Company Name */}
              <div className="text-white text-xs font-bold tracking-wide">
                Tech & the City
              </div>
            </div>
            
            {/* Sections */}
            <div className="text-xs text-gray-300 text-center flex-1">
              <div className="font-semibold text-white mb-2">{t('footer.sections')}</div>
              <ul className="space-y-1">
                <li><a className="hover:text-blue-400 transition-colors" href="/about">{t('nav.about')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="/articles">{t('nav.articles')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="/events">{t('nav.events')}</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="/contact">{t('nav.contact')}</a></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div className="text-xs text-gray-300 text-center flex-1">
              <div className="font-semibold text-white mb-2">{t('footer.connect')}</div>
              <div className="flex items-center justify-center gap-2">
                <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="text-white font-bold text-sm">𝕏</span></a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout - Evenly Spaced */}
        <div className="hidden md:flex justify-between items-start">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="relative bg-gray-800 p-4 w-20 h-16">
              {/* Frame lines - uniform thickness */}
              <div className="absolute inset-0">
                {/* Top line - full width */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                {/* Right line - full height */}
                <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
                {/* Bottom line - only right part, no left part */}
                <div className="absolute bottom-0 right-0 w-8 h-1 bg-white"></div>
                {/* Left line - only top part, no bottom part */}
                <div className="absolute top-0 left-0 w-1 h-8 bg-white"></div>
                {/* Bottom-left corner is completely missing */}
              </div>
              {/* T&C Text */}
              <div className="text-white font-bold text-xl tracking-wide relative z-10 flex items-center justify-center h-full">
                T&C
              </div>
            </div>
            {/* Company Name */}
            <div className="text-white text-xl font-bold tracking-wide">
              Tech & the City
            </div>
          </div>
          
          {/* Sections */}
          <div className="text-sm text-gray-300 text-center">
            <div className="font-semibold text-white mb-3">{t('footer.sections')}</div>
            <ul className="space-y-2">
              <li><a className="hover:text-blue-400 transition-colors" href="/about">{t('nav.about')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors" href="/articles">{t('nav.articles')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors" href="/events">{t('nav.events')}</a></li>
              <li><a className="hover:text-blue-400 transition-colors" href="/contact">{t('nav.contact')}</a></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div className="text-sm text-gray-300 text-center">
            <div className="font-semibold text-white mb-3">{t('footer.connect')}</div>
            <div className="flex items-center justify-center gap-4">
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