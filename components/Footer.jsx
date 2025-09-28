'use client';

import { Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import { t, getCurrentLanguage } from "../lib/translations";

export default function Footer(){
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
  <footer className="border-t border-gray-700 bg-gray-800 mt-16">
    <div className="max-w-7xl mx-auto px-8 py-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          {/* Mobile Layout - Same as Desktop: Logo left, sections center, follow us right */}
          <div className="md:hidden w-full flex items-start justify-between gap-4">
            {/* Logo - Left */}
            <div className="flex items-start">
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
            </div>

            {/* Sections Column - Center */}
            <div className="flex-1 text-center">
              <div className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-4">
                {t('footer.sections', currentLang)}
              </div>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/about">{t('nav.about', currentLang)}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/articles">{t('nav.articles', currentLang)}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/events">{t('nav.events', currentLang)}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/contact">{t('nav.contact', currentLang)}</a></li>
              </ul>
            </div>

            {/* Connect Column - Right */}
            <div className="flex items-start">
              <div className="text-center">
                <div className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-4">
                  {t('footer.followUs', currentLang)}
                </div>
                <div className="flex items-center justify-center">
                  <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <Linkedin className="h-4 w-4 text-white" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Logo left, sections center, follow us right */}
          <div className="hidden md:flex w-full items-start justify-between gap-8">
            {/* Logo - Far Left */}
            <div className="flex items-start">
              <div className="relative bg-gray-800 p-5 w-22 h-18">
                {/* Frame lines - uniform thickness */}
                <div className="absolute inset-0">
                  {/* Top line - full width */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                  {/* Right line - full height */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
                  {/* Bottom line - only right part, no left part */}
                  <div className="absolute bottom-0 right-0 w-9 h-1 bg-white"></div>
                  {/* Left line - only top part, no bottom part */}
                  <div className="absolute top-0 left-0 w-1 h-9 bg-white"></div>
                  {/* Bottom-left corner is completely missing */}
                </div>
                {/* T&C Text */}
                <div className="text-white font-bold text-xl tracking-wide relative z-10 flex items-center justify-center h-full">
                  T&C
                </div>
              </div>
            </div>

            {/* Sections Column - Center */}
            <div className="flex-1 text-center">
              <div className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-4">
                {t('footer.sections', currentLang)}
              </div>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/about">{t('nav.about', currentLang)}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/articles">{t('nav.articles', currentLang)}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/events">{t('nav.events', currentLang)}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/contact">{t('nav.contact', currentLang)}</a></li>
              </ul>
            </div>

            {/* Connect Column - Far Right */}
            <div className="flex items-start">
              <div className="text-center">
                <div className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-4">
                  {t('footer.followUs', currentLang)}
                </div>
                <div className="flex items-center justify-center">
                  <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <Linkedin className="h-4 w-4 text-white" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Section */}
      <div className="border-t border-gray-700 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Tech & the City • {t('footer.madeWith', currentLang)} • {t('footer.allRights', currentLang)}.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <a className="hover:text-gray-300 transition-colors" href="/privacy">{t('footer.privacyPolicy', currentLang)}</a>
              <a className="hover:text-gray-300 transition-colors" href="/terms">{t('footer.termsOfService', currentLang)}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}