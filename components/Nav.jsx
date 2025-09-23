'use client';

import { Sparkles, Newspaper, Search } from "lucide-react";
import SimpleLanguageSwitcher from "./SimpleLanguageSwitcher";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useTranslation } from "../lib/useTranslation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav(){
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Mobile: Logo only, Desktop: Logo + Title */}
        <div className="sm:hidden">
          <div className="relative bg-gray-800 p-3 sm:p-4 w-16 h-12 sm:w-20 sm:h-16">
            {/* Frame lines - uniform thickness */}
            <div className="absolute inset-0">
              {/* Top line - full width */}
              <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
              {/* Right line - full height */}
              <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
              {/* Bottom line - only right part, no left part */}
              <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-1 bg-white"></div>
              {/* Left line - only top part, no bottom part */}
              <div className="absolute top-0 left-0 w-1 h-6 sm:h-8 bg-white"></div>
              {/* Bottom-left corner is completely missing */}
            </div>
            {/* T&C Text */}
            <div className="text-white font-bold text-lg sm:text-xl tracking-wide relative z-10 flex items-center justify-center h-full">
              T&C
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <Logo />
        </div>
        
        {/* Mobile: Centered Title */}
        <div className="sm:hidden flex-1 flex justify-center">
          <div className="text-white text-base sm:text-lg md:text-xl font-bold tracking-wide" style={{
            fontFamily: '"Space Grotesk", "Inter", "SF Pro Display", "Helvetica Neue", "Avenir Next", "Segoe UI", Roboto, sans-serif',
            fontWeight: '500',
            letterSpacing: '-0.02em',
            wordSpacing: '0.01em',
            fontSize: '1.2rem',
            fontStyle: 'normal',
            textShadow: 'none',
            textTransform: 'uppercase',
            fontStretch: 'condensed',
            textRendering: 'geometricPrecision',
            fontVariant: 'normal',
            fontFeatureSettings: '"ss01" 1, "ss02" 1, "ss03" 1',
            fontOpticalSizing: 'none',
            fontVariationSettings: '"wght" 500, "slnt" 0',
            transform: 'scaleX(0.95)'
          }}>
            TECH <span style={{ fontWeight: '400', fontSize: '1rem' }}>&</span> THE CITY
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base text-white">
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/">{t('nav.home')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/about">{t('nav.about')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/articles">{t('nav.articles')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/events">{t('nav.events')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/contact">{t('nav.contact')}</a>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block w-32 xl:w-40">
            <SearchBar />
          </div>
          
          {/* Language Switcher */}
          <SimpleLanguageSwitcher />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-white hover:text-blue-400 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 sm:px-6 py-4 space-y-4">
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/articles"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.articles')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.events')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.contact')}
            </a>
            
            {/* Mobile Search */}
            <div className="pt-4 border-t border-gray-700">
              <SearchBar isMobile={true} />
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="pt-4 border-t border-gray-700">
              <SimpleLanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}