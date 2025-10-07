'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics tracking immediately
    if (typeof window !== 'undefined') {
      // Track page view via API with enhanced device info
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pageview',
          url: pathname,
          title: document.title,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
          },
          devicePixelRatio: window.devicePixelRatio || 1,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          connectionType: navigator.connection?.effectiveType || 'unknown'
        })
      }).catch(console.error);
      
      // Track time on page
      let startTime = Date.now();
      
      const handleBeforeUnload = () => {
        const timeSpent = Date.now() - startTime;
        if (timeSpent > 1000) { // Only track if spent more than 1 second
          // Track time spent via API
          fetch('/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'event',
              eventType: 'time_spent',
              eventData: { timeSpent }
            })
          }).catch(console.error);
        }
      };
      
      // Track scroll depth
      let maxScrollDepth = 0;
      const handleScroll = () => {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          if (scrollDepth >= 25 && scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            // Track scroll depth via API
            fetch('/api/analytics', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'event',
                eventType: 'scroll_depth',
                eventData: { scrollDepth }
              })
            }).catch(console.error);
          }
        }
      };
      
      // Track clicks for heatmaps and social sharing
      const handleClick = (event) => {
        const rect = event.target.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);
        
        // Check if it's a social sharing button
        const target = event.target;
        const isSocialShare = target.closest('[data-social-share]') || 
                             target.closest('a[href*="facebook.com"]') ||
                             target.closest('a[href*="twitter.com"]') ||
                             target.closest('a[href*="linkedin.com"]') ||
                             target.closest('a[href*="whatsapp.com"]') ||
                             target.closest('a[href*="telegram.me"]') ||
                             target.closest('a[href*="instagram.com"]') ||
                             target.closest('a[href*="pinterest.com"]') ||
                             target.closest('a[href*="reddit.com"]') ||
                             target.closest('a[href*="tiktok.com"]') ||
                             target.closest('a[href*="youtube.com"]');
        
        if (isSocialShare) {
          // Extract social platform from URL or data attribute
          let socialPlatform = 'unknown';
          const href = target.closest('a')?.href || '';
          const dataPlatform = target.closest('[data-social-share]')?.getAttribute('data-social-share');
          
          if (dataPlatform) {
            socialPlatform = dataPlatform;
          } else if (href.includes('facebook.com')) {
            socialPlatform = 'facebook';
          } else if (href.includes('twitter.com') || href.includes('x.com')) {
            socialPlatform = 'twitter';
          } else if (href.includes('linkedin.com')) {
            socialPlatform = 'linkedin';
          } else if (href.includes('whatsapp.com')) {
            socialPlatform = 'whatsapp';
          } else if (href.includes('telegram.me')) {
            socialPlatform = 'telegram';
          } else if (href.includes('instagram.com')) {
            socialPlatform = 'instagram';
          } else if (href.includes('pinterest.com')) {
            socialPlatform = 'pinterest';
          } else if (href.includes('reddit.com')) {
            socialPlatform = 'reddit';
          } else if (href.includes('tiktok.com')) {
            socialPlatform = 'tiktok';
          } else if (href.includes('youtube.com')) {
            socialPlatform = 'youtube';
          }
          
          // Track social share event
          fetch('/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'event',
              eventType: 'social_share',
              eventData: { 
                platform: socialPlatform,
                url: pathname,
                title: document.title,
                timestamp: new Date().toISOString()
              }
            })
          }).catch(console.error);
        }
        
        // Track regular click via API
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'click',
            url: pathname,
            x: x,
            y: y,
            element: event.target.tagName,
            userAgent: navigator.userAgent,
            isSocialShare: !!isSocialShare,
            socialPlatform: isSocialShare ? socialPlatform : null
          })
        }).catch(console.error);
      };

      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('click', handleClick);
      
      // Cleanup
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('click', handleClick);
      };
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}


