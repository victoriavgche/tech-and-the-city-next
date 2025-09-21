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
        <Logo />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm text-white">
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/">{t('nav.home')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/articles">{t('nav.articles')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/events">{t('nav.events')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/about">{t('nav.about')}</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/contact">Contact</a>
          <a className="hover:text-blue-400 transition-colors duration-200 font-medium" href="/admin">Admin</a>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-40">
            <SearchBar />
          </div>
          
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
          <div className="px-6 py-4 space-y-4">
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium" 
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium" 
              href="/articles"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.articles')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium" 
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.events')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium" 
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium" 
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <a 
              className="block text-white hover:text-blue-400 transition-colors duration-200 font-medium" 
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </a>
            
            {/* Mobile Search */}
            <div className="pt-4 border-t border-gray-700">
              <SearchBar isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}