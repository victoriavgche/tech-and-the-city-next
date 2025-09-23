'use client';

import { Github, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "../lib/useTranslation";

export default function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-700 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative bg-gray-800 p-3 w-16 h-12">
                {/* Frame lines - uniform thickness */}
                <div className="absolute inset-0">
                  {/* Top line - full width */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                  {/* Right line - full height */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
                  {/* Bottom line - only right part, no left part */}
                  <div className="absolute bottom-0 right-0 w-6 h-1 bg-white"></div>
                  {/* Left line - only top part, no bottom part */}
                  <div className="absolute top-0 left-0 w-1 h-6 bg-white"></div>
                  {/* Bottom-left corner is completely missing */}
                </div>
                {/* T&C Text */}
                <div className="text-white font-bold text-sm tracking-wide relative z-10 flex items-center justify-center h-full">
                  T&C
                </div>
              </div>
              <div className="text-black text-lg font-bold tracking-wide">
                Tech & the City
              </div>
            </div>
          </div>

          {/* Sections Column */}
          <div className="md:col-span-1">
            <div className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-4">
              SECTIONS
            </div>
            <ul className="space-y-2">
              <li><a className="text-gray-700 hover:text-blue-600 transition-colors text-sm" href="/about">{t('nav.about')}</a></li>
              <li><a className="text-gray-700 hover:text-blue-600 transition-colors text-sm" href="/articles">{t('nav.articles')}</a></li>
              <li><a className="text-gray-700 hover:text-blue-600 transition-colors text-sm" href="/events">{t('nav.events')}</a></li>
              <li><a className="text-gray-700 hover:text-blue-600 transition-colors text-sm" href="/contact">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-1">
            <div className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-4">
              FOLLOW US
            </div>
            <div className="flex items-center gap-3">
              <a className="hover:text-blue-600 transition-colors" href="https://instagram.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
              </a>
              <a className="hover:text-blue-600 transition-colors" href="https://www.linkedin.com/company/techandthecity101/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <Linkedin className="h-4 w-4 text-white" />
                </div>
              </a>
              <a className="hover:text-blue-600 transition-colors" href="https://x.com/techandthecity" target="_blank" rel="noopener noreferrer" aria-label="X">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">𝕏</span>
                </div>
              </a>
            </div>
          </div>

          {/* Empty column for spacing */}
          <div className="md:col-span-1"></div>
        </div>
      </div>
      
      {/* Bottom Copyright Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Tech & the City. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <a className="hover:text-gray-700 transition-colors" href="/privacy">Privacy Policy</a>
              <a className="hover:text-gray-700 transition-colors" href="/terms">Terms of Service</a>
              <a className="hover:text-gray-700 transition-colors" href="/contact">Contact</a>
              <a className="hover:text-gray-700 transition-colors" href="/about">About Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}