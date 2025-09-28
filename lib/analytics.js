// Privacy-friendly analytics system
// No cookies, no personal data collection

class Analytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.events = [];
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Track page view
  trackPageView(page, referrer = null) {
    const pageView = {
      sessionId: this.sessionId,
      page: page,
      referrer: referrer,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.pageViews.push(pageView);
    this.sendAnalytics('pageview', pageView);
  }

  // Track events (shares, clicks, etc.)
  trackEvent(eventType, data = {}) {
    const event = {
      sessionId: this.sessionId,
      eventType: eventType,
      data: data,
      timestamp: Date.now(),
      page: window.location.pathname
    };

    this.events.push(event);
    this.sendAnalytics('event', event);
  }

  // Track click-through rates (CTR)
  trackClick(elementType, targetUrl, additionalData = {}) {
    const clickData = {
      sessionId: this.sessionId,
      elementType: elementType, // 'article_link', 'event_link', 'nav_link', 'social_share'
      targetUrl: targetUrl,
      sourcePage: window.location.pathname,
      position: additionalData.position || 'unknown',
      timestamp: Date.now(),
      data: additionalData
    };

    this.sendAnalytics('click', clickData);
  }

  // Track time spent on page
  trackTimeSpent(timeSpent) {
    this.trackEvent('time_spent', {
      time: timeSpent,
      page: window.location.pathname
    });
  }

  // Track scroll depth
  trackScrollDepth(depth) {
    this.trackEvent('scroll_depth', {
      depth: depth,
      page: window.location.pathname
    });
  }

  // Track article engagement
  trackArticleEngagement(articleSlug, action, data = {}) {
    this.trackEvent('article_engagement', {
      article: articleSlug,
      action: action, // 'read', 'share', 'scroll', 'time_spent'
      ...data
    });
  }

  // Track newsletter subscription
  trackNewsletterSubscription(source = 'unknown') {
    this.trackEvent('newsletter_subscription', {
      source: source,
      page: window.location.pathname
    });
  }

  // Send data to server
  async sendAnalytics(type, data) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          data: data
        })
      });
    } catch (error) {
      console.log('Analytics error:', error);
    }
  }

  // Get visitor location (approximate, no personal data)
  async getVisitorLocation() {
    try {
      const response = await fetch('/api/analytics/location');
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  }
}

// Initialize analytics immediately
if (typeof window !== 'undefined') {
  window.analytics = new Analytics();
  
  // Track initial page view immediately
  window.analytics.trackPageView(window.location.pathname, document.referrer);
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      window.analytics.trackEvent('page_visible');
    } else {
      window.analytics.trackEvent('page_hidden');
    }
  });

  // Track bounce rate and engagement metrics immediately
  let startTime = Date.now();
  let pagesInSession = 1;
  let hasScrolled = false;
  let hasClicked = false;
  let maxScrollDepth = 0;

  // Track scroll depth for bounce rate calculation
  window.addEventListener('scroll', () => {
    hasScrolled = true;
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
  });

  // Track clicks for engagement
  document.addEventListener('click', () => {
    hasClicked = true;
  });

  // Track pages per session (for SPA navigation)
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    pagesInSession++;
    originalPushState.apply(history, args);
  };

  window.addEventListener('popstate', () => {
    pagesInSession++;
  });

  // Track bounce rate on page unload
  window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - startTime;
    window.analytics.trackBounceRate({
      hasScrolled: hasScrolled,
      hasClicked: hasClicked,
      maxScrollDepth: maxScrollDepth,
      pagesInSession: pagesInSession,
      timeSpent: timeSpent
    });
  });
}

export default Analytics;
