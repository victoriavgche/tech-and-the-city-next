'use client';

import { Github, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";

export default function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-700 bg-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
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
                SECTIONS
              </div>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/about">{t('nav.about')}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/articles">{t('nav.articles')}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/events">{t('nav.events')}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/contact">{t('nav.contact')}</a></li>
              </ul>
            </div>

            {/* Connect Column - Right */}
            <div className="flex items-start">
              <div className="text-center">
                <div className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-4">
                  FOLLOW US
                </div>
                <div className="flex items-center justify-center gap-3">
                  <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                  </a>
                  <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <Linkedin className="h-4 w-4 text-white" />
                    </div>
                  </a>
                  <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">𝕏</span>
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
                SECTIONS
              </div>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/about">{t('nav.about')}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/articles">{t('nav.articles')}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/events">{t('nav.events')}</a></li>
                <li><a className="text-gray-300 hover:text-blue-400 transition-colors text-sm" href="/contact">{t('nav.contact')}</a></li>
              </ul>
            </div>

            {/* Connect Column - Far Right */}
            <div className="flex items-start">
              <div className="text-center">
                <div className="text-blue-400 font-semibold text-sm uppercase tracking-wide mb-4">
                  FOLLOW US
                </div>
                <div className="flex items-center justify-center gap-3">
                  <a className="hover:text-blue-400 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                  </a>
                  <a className="hover:text-blue-400 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <Linkedin className="h-4 w-4 text-white" />
                    </div>
                  </a>
                  <a className="hover:text-blue-400 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">𝕏</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Section */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Tech & the City • Made with attitude • All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <a className="hover:text-gray-300 transition-colors" href="/privacy">Privacy Policy</a>
              <a className="hover:text-gray-300 transition-colors" href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}