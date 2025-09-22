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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Mobile: Logo only, Desktop: Logo + Title */}
        <div className="md:hidden">
          <div className="relative bg-gray-800 p-2 w-10 h-8">
            {/* Frame lines - uniform thickness */}
            <div className="absolute inset-0">
              {/* Top line - full width */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white"></div>
              {/* Right line - full height */}
              <div className="absolute top-0 right-0 w-0.5 h-full bg-white"></div>
              {/* Bottom line - only right part, no left part */}
              <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-white"></div>
              {/* Left line - only top part, no bottom part */}
              <div className="absolute top-0 left-0 w-0.5 h-4 bg-white"></div>
              {/* Bottom-left corner is completely missing */}
            </div>
            {/* T&C Text */}
            <div className="text-white font-bold text-xs tracking-wide relative z-10 flex items-center justify-center h-full">
              T&C
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>
        
        {/* Mobile: Centered Title */}
        <div className="md:hidden flex-1 flex justify-center">
          <div className="text-white text-xl font-bold tracking-wide">
            Tech & the City
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-base text-white">
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/">{t('nav.home')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/about">{t('nav.about')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/articles">{t('nav.articles')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/events">{t('nav.events')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/contact">{t('nav.contact')}</a>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-40">
            <SearchBar />
          </div>
          
          {/* Language Switcher */}
          <SimpleLanguageSwitcher />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-6 py-4 space-y-5">
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