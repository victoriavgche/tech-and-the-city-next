'use client';

import Logo from "./Logo";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { t, getCurrentLanguage } from "../lib/translations";
import './analytics.js';

export default function Nav(){
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  
  const handleNavClick = (targetUrl, elementType) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackClick(elementType, targetUrl, {
        position: 'navigation'
      });
    }
  };
  
  return (
    <nav className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Mobile: Logo only, Desktop: Logo + Title */}
        <div className="md:hidden">
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
        <div className="hidden md:block">
          <Logo />
        </div>
        
        {/* Mobile: Centered Title */}
        <div className="md:hidden flex-1 flex justify-center">
          <a href="/" className="text-white text-xl font-bold tracking-wide hover:text-blue-400 transition-colors" style={{
            fontFamily: '"Space Grotesk", "Inter", "SF Pro Display", "Helvetica Neue", "Avenir Next", "Segoe UI", Roboto, sans-serif',
            fontWeight: '500',
            letterSpacing: '-0.02em',
            wordSpacing: '0.01em',
            fontSize: '1.5rem',
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
            TECH <span style={{ fontWeight: '400', fontSize: '1.2rem' }}>&</span> THE CITY
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12 text-base lg:text-lg text-white">
          <a 
            className="hover:text-blue-400 transition-colors duration-200 font-medium" 
            href="/"
            onClick={() => handleNavClick('/', 'nav_link')}
          >
            {t('nav.home', currentLang)}
          </a>
          <a 
            className="hover:text-blue-400 transition-colors duration-200 font-medium" 
            href="/about"
            onClick={() => handleNavClick('/about', 'nav_link')}
          >
            {t('nav.about', currentLang)}
          </a>
          <a 
            className="hover:text-blue-400 transition-colors duration-200 font-medium" 
            href="/articles"
            onClick={() => handleNavClick('/articles', 'nav_link')}
          >
            {t('nav.articles', currentLang)}
          </a>
          <a 
            className="hover:text-blue-400 transition-colors duration-200 font-medium" 
            href="/events"
            onClick={() => handleNavClick('/events', 'nav_link')}
          >
            {t('nav.events', currentLang)}
          </a>
          <a 
            className="hover:text-blue-400 transition-colors duration-200 font-medium" 
            href="/contact"
            onClick={() => handleNavClick('/contact', 'nav_link')}
          >
            {t('nav.contact', currentLang)}
          </a>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-4 space-y-4">
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/', 'nav_link');
              }}
            >
              {t('nav.home', currentLang)}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/about"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/about', 'nav_link');
              }}
            >
              {t('nav.about', currentLang)}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base"
              href="/articles"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/articles', 'nav_link');
              }}
            >
              {t('nav.articles', currentLang)}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/events"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/events', 'nav_link');
              }}
            >
              {t('nav.events', currentLang)}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium text-base" 
              href="/contact"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('/contact', 'nav_link');
              }}
            >
              {t('nav.contact', currentLang)}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}