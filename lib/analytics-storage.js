import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');
const DATA_DIR = path.join(process.cwd(), 'data');

// Cache for analytics data
let analyticsCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize analytics data structure
const defaultAnalyticsData = {
  pageViews: [],
  events: [],
  clicks: [],
  sessions: {},
  metadata: {
    firstDay: null,
    lastUpdated: null,
    totalSessions: 0
  }
};

// Load analytics data from file with caching
export function loadAnalyticsData() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (analyticsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return analyticsCache;
  }
  
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      
      // Set first day if not exists
      if (!parsed.metadata.firstDay && parsed.pageViews.length > 0) {
        const firstView = parsed.pageViews.reduce((earliest, view) => 
          view.timestamp < earliest ? view.timestamp : earliest, 
          parsed.pageViews[0].timestamp
        );
        parsed.metadata.firstDay = firstView;
      }
      
      // Cache the data
      analyticsCache = parsed;
      cacheTimestamp = now;
      
      return parsed;
    }
  } catch (error) {
    console.error('Error loading analytics data:', error);
  }
  
  // Return empty data structure for real data collection
  const emptyData = {
    ...defaultAnalyticsData,
    metadata: {
      ...defaultAnalyticsData.metadata,
      firstDay: null
    }
  };
  
  analyticsCache = emptyData;
  cacheTimestamp = now;
  return emptyData;
}

// Save analytics data to file
export function saveAnalyticsData(data) {
  try {
    // Update metadata
    data.metadata.lastUpdated = Date.now();
    
    if (!data.metadata.firstDay && data.pageViews.length > 0) {
      const firstView = data.pageViews.reduce((earliest, view) => 
        view.timestamp < earliest ? view.timestamp : earliest, 
        data.pageViews[0].timestamp
      );
      data.metadata.firstDay = firstView;
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    // Invalidate cache when data is saved
    analyticsCache = null;
    cacheTimestamp = 0;
    
    return true;
  } catch (error) {
    console.error('Error saving analytics data:', error);
    return false;
  }
}

// Add new data entry
export function addAnalyticsEntry(type, entryData) {
  const data = loadAnalyticsData();
  
  switch (type) {
    case 'pageview':
      data.pageViews.push(entryData);
      break;
    case 'event':
      data.events.push(entryData);
      break;
    case 'click':
      data.clicks.push(entryData);
      break;
    default:
      break;
  }
  
  // Update session count
  if (type === 'pageview') {
    const sessionId = entryData.sessionId;
    if (!data.sessions[sessionId]) {
      data.sessions[sessionId] = {
        id: sessionId,
        firstSeen: entryData.timestamp,
        lastSeen: entryData.timestamp,
        pageViews: 1
      };
      data.metadata.totalSessions++;
    } else {
      data.sessions[sessionId].lastSeen = entryData.timestamp;
      data.sessions[sessionId].pageViews++;
    }
  }
  
  return saveAnalyticsData(data);
}

// Get analytics data with filtering
export function getAnalyticsData(type, period = 'all') {
  const data = loadAnalyticsData();
  const now = Date.now();
  
  // Calculate period filters
  const periodMs = {
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
    'all': data.metadata.firstDay ? now - data.metadata.firstDay : Infinity
  };
  
  const cutoffTime = period === 'all' && data.metadata.firstDay 
    ? data.metadata.firstDay 
    : now - periodMs[period];
  
  // Optimized filtering - only filter what we need based on type
  let recentPageViews, recentEvents, recentClicks;
  
  if (type === 'overview' || type === 'sources' || type === 'popular_articles' || 
      type === 'click_through_rates' || type === 'daily_stats' || type === 'all') {
    recentPageViews = data.pageViews.filter(pv => pv.timestamp > cutoffTime);
  }
  
  if (type === 'engagement' || type === 'all') {
    recentEvents = data.events.filter(ev => ev.timestamp > cutoffTime);
  }
  
  if (type === 'click_through_rates' || type === 'daily_stats' || type === 'all') {
    recentClicks = data.clicks.filter(click => click.timestamp > cutoffTime);
  }
  
  switch (type) {
    case 'overview':
      return {
        totalVisits: recentPageViews ? recentPageViews.length : 0,
        uniqueVisitors: recentPageViews ? new Set(recentPageViews.map(pv => pv.sessionId)).size : 0,
        totalClicks: recentClicks ? recentClicks.length : 0,
        totalEvents: recentEvents ? recentEvents.length : 0,
        totalSessions: Object.keys(data.sessions).length,
        period: period,
        firstDay: data.metadata.firstDay ? new Date(data.metadata.firstDay).toLocaleDateString() : 'No data',
        lastUpdated: data.metadata.lastUpdated ? new Date(data.metadata.lastUpdated).toLocaleDateString() : 'Never'
      };
      
    case 'sources':
      const sources = {};
      if (recentPageViews) {
        recentPageViews.forEach(pv => {
          const source = pv.referrer ? 
            (pv.referrer.includes('google') ? 'Google' :
             pv.referrer.includes('facebook') ? 'Facebook' :
             pv.referrer.includes('twitter') ? 'Twitter' :
             pv.referrer.includes('linkedin') ? 'LinkedIn' :
             pv.referrer.includes('instagram') ? 'Instagram' :
             'Other') : 'Direct';
          sources[source] = (sources[source] || 0) + 1;
        });
      }
      return sources;
      
    case 'popular_articles':
      const articleViews = {};
      if (recentPageViews) {
        recentPageViews
          .filter(pv => pv.page.startsWith('/articles/'))
          .forEach(pv => {
            const article = pv.page.split('/articles/')[1];
            if (article) { // Only count valid articles
              articleViews[article] = (articleViews[article] || 0) + 1;
            }
          });
      }
      
      const sortedArticles = Object.entries(articleViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20); // Increased limit for better insights
      
      return sortedArticles;
      
    case 'click_through_rates':
      const ctrData = {};
      
      // Group clicks by element type
      if (recentClicks) {
        recentClicks.forEach(click => {
          const elementType = click.elementType || 'unknown';
          if (!ctrData[elementType]) {
            ctrData[elementType] = { clicks: 0, views: 0 };
          }
          ctrData[elementType].clicks++;
        });
      }
      
      // Calculate total page views for CTR calculation
      const totalViews = recentPageViews ? recentPageViews.length : 0;
      
      // Convert to array format expected by dashboard
      const ctrArray = Object.entries(ctrData).map(([elementType, data]) => {
        const ctr = totalViews > 0 ? (data.clicks / totalViews) * 100 : 0;
        return {
          elementType,
          clicks: data.clicks,
          ctr: parseFloat(ctr.toFixed(2))
        };
      });
      
      // Sort by clicks descending and limit results
      return ctrArray.sort((a, b) => b.clicks - a.clicks).slice(0, 15);
      
    case 'engagement':
      const engagementData = {
        averageTimeOnPage: 0,
        bounceRate: 0,
        averagePagesPerSession: 0,
        scrollDepth: {},
        shares: {},
        newsletterSubscriptions: 0,
        contactFormSubmissions: 0,
        eventInteractions: 0
      };
      
      if (recentEvents) {
        // Calculate average time on page
        const timeEvents = recentEvents.filter(ev => ev.eventType === 'time_spent');
        if (timeEvents.length > 0) {
          engagementData.averageTimeOnPage = 
            timeEvents.reduce((sum, ev) => sum + (ev.data.time || 0), 0) / timeEvents.length;
        }

        // Calculate bounce rate and pages per session
        const bounceEvents = recentEvents.filter(ev => ev.eventType === 'bounce_rate');
        if (bounceEvents.length > 0) {
          const bouncedSessions = bounceEvents.filter(ev => !ev.data.hasScrolled && !ev.data.hasClicked).length;
          engagementData.bounceRate = (bouncedSessions / bounceEvents.length) * 100;
          
          const totalPages = bounceEvents.reduce((sum, ev) => sum + (ev.data.pagesInSession || 1), 0);
          engagementData.averagePagesPerSession = totalPages / bounceEvents.length;
        }
        
        // Track shares by platform
        recentEvents
          .filter(ev => ev.eventType === 'social_share')
          .forEach(ev => {
            const platform = ev.data.platform || 'unknown';
            engagementData.shares[platform] = (engagementData.shares[platform] || 0) + 1;
          });

        // Track newsletter subscriptions
        const newsletterEvents = recentEvents.filter(ev => ev.eventType === 'newsletter_subscription');
        engagementData.newsletterSubscriptions = newsletterEvents.length;

        // Track contact form submissions
        const contactEvents = recentEvents.filter(ev => ev.eventType === 'contact_form_submission');
        engagementData.contactFormSubmissions = contactEvents.length;

        // Track event interest
        const eventEvents = recentEvents.filter(ev => ev.eventType === 'event_interest');
        engagementData.eventInteractions = eventEvents.length;
      }
      
      return engagementData;
      
    case 'daily_stats':
      // Group data by day with pagination support
      const dailyStats = {};
      if (recentPageViews) {
        recentPageViews.forEach(pv => {
          const day = new Date(pv.timestamp).toDateString();
          if (!dailyStats[day]) {
            dailyStats[day] = {
              date: day,
              visits: 0,
              uniqueVisitors: new Set(),
              clicks: 0
            };
          }
          dailyStats[day].visits++;
          dailyStats[day].uniqueVisitors.add(pv.sessionId);
        });
      }
      
      if (recentClicks) {
        recentClicks.forEach(click => {
          const day = new Date(click.timestamp).toDateString();
          if (dailyStats[day]) {
            dailyStats[day].clicks++;
          }
        });
      }
      
      // Convert to array and format - show all data from first day
      return Object.values(dailyStats)
        .map(day => ({
          ...day,
          uniqueVisitors: day.uniqueVisitors.size
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    case 'all':
      // Return comprehensive analytics data with optimized data loading
      const allData = {
        overview: null,
        sources: null,
        popular_articles: null,
        click_through_rates: null,
        engagement: null,
        daily_stats: null,
        all_time_stats: getAllTimeStats()
      };
      
      // Load all data types efficiently
      try {
        allData.overview = getAnalyticsData('overview', period);
        allData.sources = getAnalyticsData('sources', period);
        allData.popular_articles = getAnalyticsData('popular_articles', period);
        allData.click_through_rates = getAnalyticsData('click_through_rates', period);
        allData.engagement = getAnalyticsData('engagement', period);
        allData.daily_stats = getAnalyticsData('daily_stats', period);
      } catch (error) {
        console.error('Error loading analytics data for all:', error);
        // Return partial data if some queries fail
      }
      
      return allData;
      
    default:
      return { error: 'Invalid analytics type' };
  }
}

// Keep all analytics data from the first day - no automatic cleanup
export function cleanupOldAnalyticsData() {
  // Data cleanup disabled - keeping all historical data
  console.log('Analytics data cleanup skipped - keeping all historical data');
}

// Get all-time statistics
export function getAllTimeStats() {
  const data = loadAnalyticsData();
  
  if (!data.metadata.firstDay) {
    return {
      totalDays: 0,
      averageDailyVisits: 0,
      totalUniqueVisitors: 0,
      firstDay: 'No data'
    };
  }
  
  const totalDays = Math.ceil((Date.now() - data.metadata.firstDay) / (24 * 60 * 60 * 1000));
  const totalVisits = data.pageViews.length;
  const uniqueVisitors = new Set(data.pageViews.map(pv => pv.sessionId)).size;
  
  return {
    totalDays,
    averageDailyVisits: totalDays > 0 ? Math.round(totalVisits / totalDays) : 0,
    totalUniqueVisitors: uniqueVisitors,
    totalSessions: Object.keys(data.sessions).length,
    firstDay: new Date(data.metadata.firstDay).toLocaleDateString(),
    lastDay: data.metadata.lastUpdated ? new Date(data.metadata.lastUpdated).toLocaleDateString() : 'Never'
  };
}
