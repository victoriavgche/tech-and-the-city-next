'use client';

import { Sparkles, Newspaper, Search } from "lucide-react";
import SimpleLanguageSwitcher from "./SimpleLanguageSwitcher";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useTranslation } from "../lib/useTranslation";

export default function Nav(){
  const { t } = useTranslation();
  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-600">
      <div className="container py-4 flex items-center justify-between">
        <Logo />
            <div className="hidden md:flex items-center gap-6 text-sm text-white">
              <a className="hover:text-blue-400 transition-colors duration-200" href="/">{t('nav.home')}</a>
              <a className="hover:text-blue-400 transition-colors duration-200" href="/about">{t('nav.about')}</a>
              <a className="hover:text-blue-400 transition-colors duration-200" href="/articles">{t('nav.articles')}</a>
              <a className="hover:text-blue-400 transition-colors duration-200" href="/events">{t('nav.events')}</a>
              <a className="hover:text-blue-400 transition-colors duration-200" href="/subscribe">{t('nav.subscribe')}</a>
              <a className="hover:text-blue-400 transition-colors duration-200" href="/contact">Contact</a>
              <a className="hover:text-blue-400 transition-colors duration-200" href="/admin/login">Admin</a>
            </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block w-64">
            {/* SearchBar temporarily disabled */}
          </div>
          <SimpleLanguageSwitcher />
        </div>
        
        {/* Mobile Search Bar - Only visible on mobile */}
        <div className="lg:hidden mt-3 px-4 pb-2">
          {/* SearchBar temporarily disabled */}
        </div>
      </div>
    </nav>
  )
}