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

// Initialize analytics
if (typeof window !== 'undefined') {
  window.analytics = new Analytics();
  
  // Track initial page view
  window.analytics.trackPageView(window.location.pathname, document.referrer);
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      window.analytics.trackEvent('page_visible');
    } else {
      window.analytics.trackEvent('page_hidden');
    }
  });
}

export default Analytics;
