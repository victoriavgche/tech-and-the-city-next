'use client';

import { Share2, Linkedin, X, Facebook, Instagram, MessageCircle, Phone } from 'lucide-react';

export default function SocialShare({ title, url, excerpt }) {
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
        // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
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
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 mb-8">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Share this article</h3>
      <div className="flex gap-3">
        <button
          onClick={() => handleShare('linkedin')}
          className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Share on X"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Share on Facebook"
        >
          <Facebook className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('instagram')}
          className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Share on Instagram"
        >
          <Instagram className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare('viber')}
          className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Share on Viber"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
