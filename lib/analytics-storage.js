import fs from 'fs';
import path from 'path';
import { generateSampleData } from './sample-data.js';

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');
const DATA_DIR = path.join(process.cwd(), 'data');

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

// Load analytics data from file
export function loadAnalyticsData() {
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
      
      return parsed;
    }
  } catch (error) {
    console.error('Error loading analytics data:', error);
  }
  
  // Return empty data structure for real data collection
  return {
    ...defaultAnalyticsData,
    metadata: {
      ...defaultAnalyticsData.metadata,
      firstDay: null
    }
  };
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
  
  // Filter data by time period
  const recentPageViews = data.pageViews.filter(pv => pv.timestamp > cutoffTime);
  const recentEvents = data.events.filter(ev => ev.timestamp > cutoffTime);
  const recentClicks = data.clicks.filter(click => click.timestamp > cutoffTime);
  
  switch (type) {
    case 'overview':
      return {
        totalVisits: recentPageViews.length,
        uniqueVisitors: new Set(recentPageViews.map(pv => pv.sessionId)).size,
        totalClicks: recentClicks.length,
        totalEvents: recentEvents.length,
        totalSessions: Object.keys(data.sessions).length,
        period: period,
        firstDay: data.metadata.firstDay ? new Date(data.metadata.firstDay).toLocaleDateString() : 'No data',
        lastUpdated: data.metadata.lastUpdated ? new Date(data.metadata.lastUpdated).toLocaleDateString() : 'Never'
      };
      
    case 'sources':
      const sources = {};
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
      return sources;
      
    case 'popular_articles':
      const articleViews = {};
      recentPageViews
        .filter(pv => pv.page.startsWith('/articles/'))
        .forEach(pv => {
          const article = pv.page.split('/articles/')[1];
          articleViews[article] = (articleViews[article] || 0) + 1;
        });
      
      const sortedArticles = Object.entries(articleViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      return sortedArticles;
      
    case 'click_through_rates':
      const ctrData = {
        article_links: {},
        event_links: {},
        nav_links: {},
        social_shares: {}
      };
      
      recentClicks.forEach(click => {
        if (click.elementType === 'article_link') {
          const article = click.targetUrl.split('/articles/')[1];
          if (!ctrData.article_links[article]) {
            ctrData.article_links[article] = { clicks: 0, views: 0 };
          }
          ctrData.article_links[article].clicks++;
        } else if (click.elementType === 'event_link') {
          const event = click.targetUrl.split('/events')[1] || 'main_events';
          if (!ctrData.event_links[event]) {
            ctrData.event_links[event] = { clicks: 0, views: 0 };
          }
          ctrData.event_links[event].clicks++;
        } else if (click.elementType === 'nav_link') {
          const navItem = click.targetUrl.split('/')[1] || 'home';
          if (!ctrData.nav_links[navItem]) {
            ctrData.nav_links[navItem] = { clicks: 0, views: 0 };
          }
          ctrData.nav_links[navItem].clicks++;
        } else if (click.elementType === 'social_share') {
          const platform = click.data.platform || 'unknown';
          if (!ctrData.social_shares[platform]) {
            ctrData.social_shares[platform] = { clicks: 0, views: 0 };
          }
          ctrData.social_shares[platform].clicks++;
        }
      });
      
      // Calculate CTR percentages
      Object.keys(ctrData).forEach(category => {
        Object.keys(ctrData[category]).forEach(item => {
          const views = recentPageViews.filter(pv => 
            pv.page.includes(item) || pv.page === '/'
          ).length;
          ctrData[category][item].views = views;
          ctrData[category][item].ctr = views > 0 ? 
            ((ctrData[category][item].clicks / views) * 100).toFixed(2) : 0;
        });
      });
      
      return ctrData;
      
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
      
      return engagementData;
      
    case 'daily_stats':
      // Group data by day
      const dailyStats = {};
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
      
      recentClicks.forEach(click => {
        const day = new Date(click.timestamp).toDateString();
        if (dailyStats[day]) {
          dailyStats[day].clicks++;
        }
      });
      
      // Convert to array and format
      return Object.values(dailyStats).map(day => ({
        ...day,
        uniqueVisitors: day.uniqueVisitors.size
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
    default:
      return { error: 'Invalid analytics type' };
  }
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
