'use client';

import { useState, useEffect, useRef } from 'react';
import { Share2, Linkedin, X, Facebook, Instagram, MessageCircle, Phone } from 'lucide-react';

export default function ShareDropdown({ title, url, excerpt }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(excerpt);

    let shareUrl = '';
    
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(url);
        alert('Article URL copied to clipboard! You can paste it in your Instagram story or post.');
        return;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'viber':
        shareUrl = `viber://forward?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
        title="Share article"
      >
        <Share2 className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-10 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 z-50 min-w-max">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare('linkedin');
              }}
              className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare('twitter');
              }}
              className="w-8 h-8 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center justify-center"
              title="X"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare('facebook');
              }}
              className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
              title="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare('instagram');
              }}
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center"
              title="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare('whatsapp');
              }}
              className="w-8 h-8 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
              title="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare('viber');
              }}
              className="w-8 h-8 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
              title="Viber"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

