'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics tracking immediately
    if (typeof window !== 'undefined') {
      // Track page view immediately
      if (window.analytics) {
        window.analytics.trackPageView(pathname, document.referrer);
      } else {
        // Load analytics script if not already loaded
        import('../lib/analytics.js').then(() => {
          if (window.analytics) {
            window.analytics.trackPageView(pathname, document.referrer);
          }
        });
      }
      
      // Track time on page
      let startTime = Date.now();
      
      const handleBeforeUnload = () => {
        const timeSpent = Date.now() - startTime;
        if (timeSpent > 1000) { // Only track if spent more than 1 second
          if (window.analytics) {
            window.analytics.trackTimeSpent(timeSpent);
          }
        }
      };
      
      // Track scroll depth
      let maxScrollDepth = 0;
      const handleScroll = () => {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          if (scrollDepth >= 25 && scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            if (window.analytics) {
              window.analytics.trackScrollDepth(scrollDepth);
            }
          }
        }
      };
      
      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('scroll', handleScroll);
      
      // Cleanup
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}


