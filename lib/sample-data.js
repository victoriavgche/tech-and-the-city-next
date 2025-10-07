// Sample analytics data for demonstration
export function generateSampleData() {
  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  // Generate sample page views
  const pageViews = [];
  const pages = ['/', '/articles', '/events', '/contact', '/about', '/articles/ai-a-ball-to-remember', '/articles/endeavor-greece'];
  const referrers = ['https://google.com', 'https://facebook.com', 'https://twitter.com', null, 'https://linkedin.com'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
  ];

  // Generate 500 page views over the last month
  for (let i = 0; i < 500; i++) {
    const timestamp = oneMonthAgo + Math.random() * (now - oneMonthAgo);
    const page = pages[Math.floor(Math.random() * pages.length)];
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const sessionId = `session_${Math.floor(Math.random() * 100)}`;
    
    pageViews.push({
      sessionId,
      page,
      referrer,
      timestamp,
      userAgent,
      screen: {
        width: Math.floor(Math.random() * 1000) + 800,
        height: Math.floor(Math.random() * 800) + 600
      },
      viewport: {
        width: Math.floor(Math.random() * 1200) + 800,
        height: Math.floor(Math.random() * 900) + 600
      }
    });
  }

  // Generate sample events
  const events = [];
  const eventTypes = ['time_spent', 'social_share', 'scroll_depth', 'newsletter_subscription'];
  const platforms = ['facebook', 'twitter', 'linkedin', 'email'];
  
  for (let i = 0; i < 150; i++) {
    const timestamp = oneMonthAgo + Math.random() * (now - oneMonthAgo);
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const sessionId = `session_${Math.floor(Math.random() * 100)}`;
    
    let data = {};
    if (eventType === 'time_spent') {
      data = { time: Math.floor(Math.random() * 300000) + 30000 }; // 30s to 5min
    } else if (eventType === 'social_share') {
      data = { platform: platforms[Math.floor(Math.random() * platforms.length)] };
    } else if (eventType === 'scroll_depth') {
      data = { depth: Math.floor(Math.random() * 100) + 10 };
    }
    
    events.push({
      sessionId,
      eventType,
      data,
      timestamp,
      page: pages[Math.floor(Math.random() * pages.length)]
    });
  }

  // Generate sample clicks
  const clicks = [];
  const elementTypes = ['article_link', 'event_link', 'nav_link', 'social_share'];
  const positions = ['header', 'footer', 'content', 'sidebar'];
  
  for (let i = 0; i < 300; i++) {
    const timestamp = oneMonthAgo + Math.random() * (now - oneMonthAgo);
    const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
    const sessionId = `session_${Math.floor(Math.random() * 100)}`;
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    let targetUrl = '/';
    if (elementType === 'article_link') {
      targetUrl = `/articles/${pages[Math.floor(Math.random() * 2) + 5]}`; // article pages
    } else if (elementType === 'event_link') {
      targetUrl = '/events';
    } else if (elementType === 'nav_link') {
      targetUrl = pages[Math.floor(Math.random() * 5)]; // main pages
    }
    
    clicks.push({
      sessionId,
      elementType,
      targetUrl,
      sourcePage: pages[Math.floor(Math.random() * pages.length)],
      position,
      timestamp,
      data: {
        platform: elementType === 'social_share' ? platforms[Math.floor(Math.random() * platforms.length)] : null
      }
    });
  }

  // Generate sessions
  const sessions = {};
  for (let i = 0; i < 100; i++) {
    const sessionId = `session_${i}`;
    const firstSeen = oneMonthAgo + Math.random() * (now - oneMonthAgo);
    sessions[sessionId] = {
      id: sessionId,
      firstSeen,
      lastSeen: firstSeen + Math.random() * 3600000, // up to 1 hour later
      pageViews: Math.floor(Math.random() * 10) + 1
    };
  }

  return {
    pageViews: pageViews.sort((a, b) => a.timestamp - b.timestamp),
    events: events.sort((a, b) => a.timestamp - b.timestamp),
    clicks: clicks.sort((a, b) => a.timestamp - b.timestamp),
    sessions,
    metadata: {
      firstDay: oneMonthAgo,
      lastUpdated: now,
      totalSessions: 100
    }
  };
}




