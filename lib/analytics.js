// Enhanced Analytics Library
const fs = require('fs');
const path = require('path');

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Load analytics data
function loadAnalytics() {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) {
      return {
        pageViews: [],
        events: [],
        clicks: [],
        sessions: [],
        uniqueUsers: [],
        userActivity: {},
        trafficSources: {},
        heatmapData: {},
        socialShares: [],
        metadata: {
          firstDay: null,
          lastUpdated: null,
          totalSessions: 0,
          totalUniqueUsers: 0,
          totalVisits: 0
        }
      };
    }
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading analytics:', error);
    return {
      pageViews: [],
      events: [],
      clicks: [],
      sessions: [],
      uniqueUsers: [],
      userActivity: {},
        trafficSources: {},
        heatmapData: {},
        socialShares: [],
        metadata: {
          firstDay: null,
          lastUpdated: null,
          totalSessions: 0,
          totalUniqueUsers: 0,
          totalVisits: 0
        }
    };
  }
}

// Save analytics data
function saveAnalytics(data) {
  try {
    data.metadata.lastUpdated = new Date().toISOString();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving analytics:', error);
    return false;
  }
}

// Add page view with enhanced tracking
function addPageView(url, title, referrer = '', userAgent = 'Unknown', sessionId = null, viewport = null, screen = null, devicePixelRatio = 1, language = 'unknown', platform = 'unknown') {
  const data = loadAnalytics();
  const timestamp = new Date().toISOString();
  const today = timestamp.split('T')[0];
  
  // Detect device type with enhanced detection
  const deviceType = detectDeviceType(userAgent);
  
  // Determine if mobile based on viewport size (additional check)
  let isMobileByViewport = false;
  if (viewport && viewport.width <= 768) {
    isMobileByViewport = true;
  }
  
  const pageView = {
    url,
    title,
    referrer,
    timestamp,
    userAgent,
    deviceType,
    sessionId: sessionId || generateSessionId(),
    viewport: viewport || { width: 0, height: 0 },
    screen: screen || { width: 0, height: 0, colorDepth: 0, pixelDepth: 0 },
    devicePixelRatio: devicePixelRatio || 1,
    language: language || 'unknown',
    platform: platform || 'unknown',
    isMobileByViewport: isMobileByViewport
  };
  
  data.pageViews.push(pageView);
  
  // Track unique visitors
  const visitorId = generateVisitorId(userAgent, referrer);
  if (!data.uniqueUsers.includes(visitorId)) {
    data.uniqueUsers.push(visitorId);
    data.metadata.totalUniqueUsers = data.uniqueUsers.length;
  }
  
  // Track traffic sources
  const source = getTrafficSource(referrer);
  if (!data.trafficSources[source]) {
    data.trafficSources[source] = 0;
  }
  data.trafficSources[source]++;
  
  // Update metadata
  if (!data.metadata.firstDay) {
    data.metadata.firstDay = today;
  }
  data.metadata.totalVisits = data.pageViews.length;
  
  return saveAnalytics(data);
}

// Add event
function addEvent(eventType, eventData = {}) {
  const data = loadAnalytics();
    const event = {
    type: eventType,
    data: eventData,
    timestamp: new Date().toISOString()
  };
  
  data.events.push(event);
  return saveAnalytics(data);
}

// Get basic stats with period filtering
function getBasicStats(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  const totalViews = filteredData.pageViews.length;
  const totalEvents = filteredData.events.length;
  const totalClicks = filteredData.clicks.length;
  
  // Get unique pages
  const uniquePages = [...new Set(filteredData.pageViews.map(pv => pv.url))].length;
  
  // Get today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayViews = filteredData.pageViews.filter(pv => 
    pv.timestamp.startsWith(today)
  ).length;
  
  // Calculate CTR (Click-through rate)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;
  
  return {
    totalViews,
    totalEvents,
    totalClicks,
    uniquePages,
    todayViews,
    ctr: parseFloat(ctr),
    firstDay: data.metadata.firstDay,
    lastUpdated: data.metadata.lastUpdated,
    period
  };
}

// Add click tracking for heatmaps
function addClick(url, x, y, element = '', userAgent = 'Unknown') {
  const data = loadAnalytics();
  
  const click = {
    url,
    x,
    y,
    element,
    deviceType: detectDeviceType(userAgent),
    timestamp: new Date().toISOString()
  };
  
  data.clicks.push(click);
  
  // Store heatmap data by URL
  if (!data.heatmapData[url]) {
    data.heatmapData[url] = [];
  }
  data.heatmapData[url].push({ x, y, deviceType: click.deviceType, timestamp: click.timestamp });
  
  return saveAnalytics(data);
}

// Filter data by period
function filterDataByPeriod(data, period) {
  if (period === 'all') return data;
  
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '30d':
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      break;
    case '60d':
      startDate = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
      break;
    case '90d':
      startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      break;
    default:
      return data;
  }
  
  const filterByDate = (items) => {
    return items.filter(item => new Date(item.timestamp) >= startDate);
  };
  
  return {
    ...data,
    pageViews: filterByDate(data.pageViews),
    events: filterByDate(data.events),
    clicks: filterByDate(data.clicks)
  };
}

// Get popular pages with period filtering
function getPopularPages(limit = 10, period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  const pageCounts = {};
  filteredData.pageViews.forEach(pv => {
    pageCounts[pv.url] = (pageCounts[pv.url] || 0) + 1;
  });
  
  return Object.entries(pageCounts)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Get traffic sources with period filtering
function getTrafficSources(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  // Recalculate traffic sources for the filtered period
  const sources = {};
  filteredData.pageViews.forEach(pv => {
    const source = getTrafficSource(pv.referrer);
    sources[source] = (sources[source] || 0) + 1;
  });
  
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

// Get heatmap data for a specific URL
function getHeatmapData(url) {
  const data = loadAnalytics();
  return data.heatmapData[url] || [];
}

// Get engagement metrics (time on page) with period filtering
function getEngagementMetrics(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  const timeEvents = filteredData.events.filter(e => e.type === 'time_spent');
  
  if (timeEvents.length === 0) {
    return { averageTime: 0, totalTime: 0, sessions: 0 };
  }
  
  const totalTime = timeEvents.reduce((sum, event) => sum + (event.data.timeSpent || 0), 0);
  const averageTime = Math.round(totalTime / timeEvents.length);
  
  return {
    averageTime,
    totalTime,
    sessions: timeEvents.length
  };
}

// Get CTR data for specific elements (articles, events, links)
function getCTRData(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  // Group clicks by element type
  const elementClicks = {};
  filteredData.clicks.forEach(click => {
    const elementType = click.element || 'unknown';
    elementClicks[elementType] = (elementClicks[elementType] || 0) + 1;
  });
  
  // Calculate CTR for each element type
  const totalViews = filteredData.pageViews.length;
  const ctrData = Object.entries(elementClicks).map(([element, clicks]) => ({
    element,
    clicks,
    ctr: totalViews > 0 ? ((clicks / totalViews) * 100).toFixed(2) : 0
  }));
  
  return ctrData.sort((a, b) => b.clicks - a.clicks);
}

// Get device analytics
function getDeviceAnalytics(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  // Group by device type
  const deviceStats = {
    mobile: { views: 0, clicks: 0, events: 0 },
    desktop: { views: 0, clicks: 0, events: 0 },
    tablet: { views: 0, clicks: 0, events: 0 }
  };
  
  // Count page views by device
  filteredData.pageViews.forEach(pv => {
    const device = pv.deviceType || 'desktop';
    if (deviceStats[device]) {
      deviceStats[device].views++;
    }
  });
  
  // Count clicks by device
  filteredData.clicks.forEach(click => {
    const device = click.deviceType || 'desktop';
    if (deviceStats[device]) {
      deviceStats[device].clicks++;
    }
  });
  
  // Count events by device (approximate from page views)
  filteredData.events.forEach(event => {
    // For simplicity, distribute events evenly across devices
    const totalViews = deviceStats.mobile.views + deviceStats.desktop.views + deviceStats.tablet.views;
    if (totalViews > 0) {
      const mobileRatio = deviceStats.mobile.views / totalViews;
      const desktopRatio = deviceStats.desktop.views / totalViews;
      const tabletRatio = deviceStats.tablet.views / totalViews;
      
      deviceStats.mobile.events += mobileRatio;
      deviceStats.desktop.events += desktopRatio;
      deviceStats.tablet.events += tabletRatio;
    }
  });
  
  // Calculate CTR for each device
  const deviceAnalytics = Object.entries(deviceStats).map(([device, stats]) => ({
    device,
    views: stats.views,
    clicks: stats.clicks,
    events: Math.round(stats.events),
    ctr: stats.views > 0 ? ((stats.clicks / stats.views) * 100).toFixed(2) : 0
  }));
  
  return deviceAnalytics.sort((a, b) => b.views - a.views);
}

// Helper functions
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateVisitorId(userAgent, referrer) {
  // Simple visitor ID based on user agent and referrer (privacy-friendly)
  const hash = userAgent + referrer;
  return 'visitor_' + hash.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0).toString(36);
}

function getTrafficSource(referrer) {
  if (!referrer || referrer === '') return 'Direct';
  
  const domain = new URL(referrer).hostname.toLowerCase();
  
  if (domain.includes('google')) return 'Google';
  if (domain.includes('facebook')) return 'Facebook';
  if (domain.includes('twitter')) return 'Twitter';
  if (domain.includes('linkedin')) return 'LinkedIn';
  if (domain.includes('instagram')) return 'Instagram';
  if (domain.includes('youtube')) return 'YouTube';
  if (domain.includes('reddit')) return 'Reddit';
  
  return 'Other';
}

function detectDeviceType(userAgent) {
  if (!userAgent || userAgent === 'Unknown') return 'desktop';
  
  const ua = userAgent.toLowerCase();
  
  // Enhanced mobile detection
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone',
    'webos', 'opera mini', 'iemobile', 'mobile safari', 'fennec',
    'mobile firefox', 'mobile chrome', 'mobile edge'
  ];
  
  // Enhanced tablet detection
  const tabletKeywords = [
    'ipad', 'tablet', 'kindle', 'silk', 'playbook', 'nexus 7', 'nexus 10',
    'galaxy tab', 'surface', 'windows rt', 'xoom', 'sch-i800'
  ];
  
  // Check for tablet first (tablets often have mobile in user agent)
  for (const keyword of tabletKeywords) {
    if (ua.includes(keyword)) {
      return 'tablet';
    }
  }
  
  // Check for mobile
  for (const keyword of mobileKeywords) {
    if (ua.includes(keyword)) {
      return 'mobile';
    }
  }
  
  // Special case: Android without mobile keyword (usually tablet)
  if (ua.includes('android') && !ua.includes('mobile')) {
    return 'tablet';
  }
  
  // Special case: iOS without mobile keyword (usually iPad)
  if (ua.includes('macintosh') && ua.includes('safari') && !ua.includes('chrome')) {
    // This could be iPad with iPadOS, but we'll default to desktop for now
    return 'desktop';
  }
  
  // Default to desktop
  return 'desktop';
}

// Social Sharing Analytics Functions
function getSocialSharingStats(period = 'all') {
  const data = loadAnalytics();
  const socialShares = filterDataByPeriod(data.socialShares || [], period);
  
  const platformStats = {};
  const urlStats = {};
  const uniqueUsers = new Set();
  
  socialShares.forEach(share => {
    const platform = share.platform || 'unknown';
    const url = share.url || 'unknown';
    const title = share.title || 'Unknown Content';
    
    // Track unique users (simple hash based on platform + url + timestamp)
    const userHash = `${platform}_${url}_${share.timestamp}`;
    uniqueUsers.add(userHash);
    
    // Platform stats
    if (!platformStats[platform]) {
      platformStats[platform] = {
        count: 0,
        uniqueUsers: new Set(),
        content: []
      };
    }
    platformStats[platform].count++;
    platformStats[platform].uniqueUsers.add(userHash);
    platformStats[platform].content.push({
      url,
      title,
      timestamp: share.timestamp
    });
    
    // URL stats
    if (!urlStats[url]) {
      urlStats[url] = {
        totalShares: 0,
        platforms: {},
        title: title,
        uniqueUsers: new Set(),
        lastShared: share.timestamp
      };
    }
    urlStats[url].totalShares++;
    urlStats[url].uniqueUsers.add(userHash);
    if (share.timestamp > urlStats[url].lastShared) {
      urlStats[url].lastShared = share.timestamp;
    }
    
    if (!urlStats[url].platforms[platform]) {
      urlStats[url].platforms[platform] = 0;
    }
    urlStats[url].platforms[platform]++;
  });
  
  return {
    totalShares: socialShares.length,
    totalUniqueUsers: uniqueUsers.size,
    platformStats: Object.entries(platformStats)
      .map(([platform, stats]) => ({
        platform,
        count: stats.count,
        uniqueUsers: stats.uniqueUsers.size,
        content: stats.content.slice(0, 5) // Top 5 recent content
      }))
      .sort((a, b) => b.count - a.count),
    urlStats: Object.entries(urlStats)
      .map(([url, stats]) => ({
        url,
        title: stats.title,
        totalShares: stats.totalShares,
        uniqueUsers: stats.uniqueUsers.size,
        lastShared: stats.lastShared,
        platforms: Object.entries(stats.platforms)
          .map(([platform, count]) => ({ platform, count }))
          .sort((a, b) => b.count - a.count)
      }))
      .sort((a, b) => b.totalShares - a.totalShares)
  };
}

function getRealTimeStats() {
  const data = loadAnalytics();
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Filter data for last 24 hours and last hour
  const last24hViews = data.pageViews.filter(view => 
    new Date(view.timestamp) >= last24Hours
  );
  const lastHourViews = data.pageViews.filter(view => 
    new Date(view.timestamp) >= lastHour
  );
  
  const last24hEvents = data.events.filter(event => 
    new Date(event.timestamp) >= last24Hours
  );
  const lastHourEvents = data.events.filter(event => 
    new Date(event.timestamp) >= lastHour
  );
  
  const last24hShares = (data.socialShares || []).filter(share => 
    new Date(share.timestamp) >= last24Hours
  );
  const lastHourShares = (data.socialShares || []).filter(share => 
    new Date(share.timestamp) >= lastHour
  );
  
  return {
    last24Hours: {
      pageViews: last24hViews.length,
      socialShares: last24hShares.length,
      uniquePages: new Set(last24hViews.map(v => v.url)).size,
      topPages: getTopPagesFromViews(last24hViews, 5)
    },
    lastHour: {
      pageViews: lastHourViews.length,
      socialShares: lastHourShares.length,
      uniquePages: new Set(lastHourViews.map(v => v.url)).size,
      topPages: getTopPagesFromViews(lastHourViews, 3)
    },
    currentTime: now.toISOString()
  };
}

function getTopPagesFromViews(views, limit = 5) {
  const pageCounts = {};
  views.forEach(view => {
    pageCounts[view.url] = (pageCounts[view.url] || 0) + 1;
  });
  
  return Object.entries(pageCounts)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function getHourlyTrafficAnalysis(period = 'all') {
  const data = loadAnalytics();
  const pageViews = filterDataByPeriod(data.pageViews, period);
  const events = filterDataByPeriod(data.events, period);
  
  // Initialize hourly counters
  const hourlyStats = {};
  for (let hour = 0; hour < 24; hour++) {
    hourlyStats[hour] = {
      hour: hour,
      pageViews: 0,
      events: 0,
      socialShares: 0,
      uniqueUsers: new Set()
    };
  }
  
  // Count page views by hour
  pageViews.forEach(view => {
    const hour = new Date(view.timestamp).getHours();
    if (hourlyStats[hour]) {
      hourlyStats[hour].pageViews++;
      if (view.userAgent) {
        hourlyStats[hour].uniqueUsers.add(view.userAgent);
      }
    }
  });
  
  // Count events by hour
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    if (hourlyStats[hour]) {
      hourlyStats[hour].events++;
      
      // Count social shares separately
      if (event.eventType === 'social_share') {
        hourlyStats[hour].socialShares++;
      }
    }
  });
  
  // Convert to array and format
  const hourlyData = Object.values(hourlyStats).map(stat => ({
    hour: stat.hour,
    hourLabel: `${stat.hour.toString().padStart(2, '0')}:00`,
    pageViews: stat.pageViews,
    events: stat.events,
    socialShares: stat.socialShares,
    uniqueUsers: stat.uniqueUsers.size,
    totalActivity: stat.pageViews + stat.socialShares
  }));
  
  // Find peak hours
  const peakHours = {
    pageViews: hourlyData.sort((a, b) => b.pageViews - a.pageViews).slice(0, 3),
    events: hourlyData.sort((a, b) => b.events - a.events).slice(0, 3),
    totalActivity: hourlyData.sort((a, b) => b.totalActivity - a.totalActivity).slice(0, 3)
  };
  
  return {
    hourlyData,
    peakHours,
    summary: {
      busiestHour: peakHours.totalActivity[0],
      quietestHour: hourlyData.sort((a, b) => a.totalActivity - b.totalActivity)[0],
      totalHours: hourlyData.filter(h => h.totalActivity > 0).length
    }
  };
}

// Enhanced Device Analytics with detailed information
function getEnhancedDeviceAnalytics(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  const deviceDetails = {
    mobile: { 
      views: 0, clicks: 0, events: 0, 
      viewports: [], screenSizes: [], pixelRatios: [],
      touchPoints: 0, languages: new Set(), platforms: new Set()
    },
    desktop: { 
      views: 0, clicks: 0, events: 0, 
      viewports: [], screenSizes: [], pixelRatios: [],
      touchPoints: 0, languages: new Set(), platforms: new Set()
    },
    tablet: { 
      views: 0, clicks: 0, events: 0, 
      viewports: [], screenSizes: [], pixelRatios: [],
      touchPoints: 0, languages: new Set(), platforms: new Set()
    }
  };
  
  // Analyze page views for device details
  filteredData.pageViews.forEach(pv => {
    const device = pv.deviceType || 'desktop';
    if (deviceDetails[device]) {
      deviceDetails[device].views++;
      
      // Collect viewport information
      if (pv.viewport && pv.viewport.width > 0) {
        deviceDetails[device].viewports.push({
          width: pv.viewport.width,
          height: pv.viewport.height
        });
      }
      
      // Collect screen information
      if (pv.screen && pv.screen.width > 0) {
        deviceDetails[device].screenSizes.push({
          width: pv.screen.width,
          height: pv.screen.height,
          colorDepth: pv.screen.colorDepth,
          pixelDepth: pv.screen.pixelDepth
        });
      }
      
      // Collect pixel ratio information
      if (pv.devicePixelRatio) {
        deviceDetails[device].pixelRatios.push(pv.devicePixelRatio);
      }
      
      // Collect language and platform info
      if (pv.language) deviceDetails[device].languages.add(pv.language);
      if (pv.platform) deviceDetails[device].platforms.add(pv.platform);
    }
  });
  
  // Analyze clicks for device details
  filteredData.clicks.forEach(click => {
    const device = click.deviceType || 'desktop';
    if (deviceDetails[device]) {
      deviceDetails[device].clicks++;
    }
  });
  
  // Calculate averages and statistics
  const enhancedAnalytics = Object.entries(deviceDetails).map(([device, stats]) => {
    const avgViewport = stats.viewports.length > 0 ? {
      width: Math.round(stats.viewports.reduce((sum, v) => sum + v.width, 0) / stats.viewports.length),
      height: Math.round(stats.viewports.reduce((sum, v) => sum + v.height, 0) / stats.viewports.length)
    } : { width: 0, height: 0 };
    
    const avgScreen = stats.screenSizes.length > 0 ? {
      width: Math.round(stats.screenSizes.reduce((sum, s) => sum + s.width, 0) / stats.screenSizes.length),
      height: Math.round(stats.screenSizes.reduce((sum, s) => sum + s.height, 0) / stats.screenSizes.length),
      colorDepth: Math.round(stats.screenSizes.reduce((sum, s) => sum + s.colorDepth, 0) / stats.screenSizes.length)
    } : { width: 0, height: 0, colorDepth: 0 };
    
    const avgPixelRatio = stats.pixelRatios.length > 0 
      ? (stats.pixelRatios.reduce((sum, r) => sum + r, 0) / stats.pixelRatios.length).toFixed(2)
      : 1;
    
    return {
      device,
      views: stats.views,
      clicks: stats.clicks,
      events: stats.events,
      ctr: stats.views > 0 ? ((stats.clicks / stats.views) * 100).toFixed(2) : 0,
      averageViewport: avgViewport,
      averageScreen: avgScreen,
      averagePixelRatio: parseFloat(avgPixelRatio),
      languages: Array.from(stats.languages),
      platforms: Array.from(stats.platforms),
      sampleSize: stats.viewports.length
    };
  });
  
  return enhancedAnalytics.sort((a, b) => b.views - a.views);
}

// Viewport Analytics
function getViewportAnalytics(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  const viewportStats = {
    commonResolutions: {},
    deviceBreakpoints: {
      mobile: 0,    // < 768px
      tablet: 0,    // 768px - 1024px
      desktop: 0    // > 1024px
    },
    aspectRatios: {}
  };
  
  filteredData.pageViews.forEach(pv => {
    if (pv.viewport && pv.viewport.width > 0) {
      const width = pv.viewport.width;
      const height = pv.viewport.height;
      const resolution = `${width}x${height}`;
      
      // Count common resolutions
      viewportStats.commonResolutions[resolution] = (viewportStats.commonResolutions[resolution] || 0) + 1;
      
      // Categorize by breakpoints
      if (width < 768) {
        viewportStats.deviceBreakpoints.mobile++;
      } else if (width <= 1024) {
        viewportStats.deviceBreakpoints.tablet++;
      } else {
        viewportStats.deviceBreakpoints.desktop++;
      }
      
      // Calculate aspect ratio
      const ratio = (width / height).toFixed(2);
      viewportStats.aspectRatios[ratio] = (viewportStats.aspectRatios[ratio] || 0) + 1;
    }
  });
  
  return {
    commonResolutions: Object.entries(viewportStats.commonResolutions)
      .map(([resolution, count]) => ({ resolution, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    deviceBreakpoints: viewportStats.deviceBreakpoints,
    aspectRatios: Object.entries(viewportStats.aspectRatios)
      .map(([ratio, count]) => ({ ratio, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  };
}

// Browser Analytics
function getBrowserAnalytics(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  const browserStats = {
    browsers: {},
    platforms: {},
    languages: {},
    userAgents: {}
  };
  
  filteredData.pageViews.forEach(pv => {
    if (pv.userAgent && pv.userAgent !== 'Unknown') {
      const ua = pv.userAgent.toLowerCase();
      
      // Detect browser
      let browser = 'Unknown';
      if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
      else if (ua.includes('firefox')) browser = 'Firefox';
      else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
      else if (ua.includes('edg')) browser = 'Edge';
      else if (ua.includes('opera')) browser = 'Opera';
      
      browserStats.browsers[browser] = (browserStats.browsers[browser] || 0) + 1;
      
      // Detect platform
      let platform = 'Unknown';
      if (ua.includes('windows')) platform = 'Windows';
      else if (ua.includes('macintosh') || ua.includes('mac os')) platform = 'macOS';
      else if (ua.includes('linux')) platform = 'Linux';
      else if (ua.includes('android')) platform = 'Android';
      else if (ua.includes('iphone') || ua.includes('ipad')) platform = 'iOS';
      
      browserStats.platforms[platform] = (browserStats.platforms[platform] || 0) + 1;
      
      // Language
      if (pv.language) {
        browserStats.languages[pv.language] = (browserStats.languages[pv.language] || 0) + 1;
      }
    }
  });
  
  return {
    browsers: Object.entries(browserStats.browsers)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count),
    platforms: Object.entries(browserStats.platforms)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count),
    languages: Object.entries(browserStats.languages)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  };
}

// Performance Metrics
function getPerformanceMetrics(period = 'all') {
  const data = loadAnalytics();
  const filteredData = filterDataByPeriod(data, period);
  
  const performanceStats = {
    pageLoadTimes: [],
    bounceRates: [],
    sessionDurations: [],
    scrollDepths: []
  };
  
  // Analyze time spent events for performance
  filteredData.events.forEach(event => {
    if (event.type === 'time_spent' && event.data.timeSpent) {
      performanceStats.pageLoadTimes.push(event.data.timeSpent);
    }
    
    if (event.type === 'scroll_depth' && event.data.depth) {
      performanceStats.scrollDepths.push(event.data.depth);
    }
  });
  
  // Calculate averages
  const avgLoadTime = performanceStats.pageLoadTimes.length > 0
    ? Math.round(performanceStats.pageLoadTimes.reduce((sum, time) => sum + time, 0) / performanceStats.pageLoadTimes.length)
    : 0;
    
  const avgScrollDepth = performanceStats.scrollDepths.length > 0
    ? Math.round(performanceStats.scrollDepths.reduce((sum, depth) => sum + depth, 0) / performanceStats.scrollDepths.length)
    : 0;
  
  return {
    averageLoadTime: avgLoadTime,
    averageScrollDepth: avgScrollDepth,
    totalSessions: performanceStats.pageLoadTimes.length,
    scrollEngagement: {
      high: performanceStats.scrollDepths.filter(d => d >= 75).length,
      medium: performanceStats.scrollDepths.filter(d => d >= 25 && d < 75).length,
      low: performanceStats.scrollDepths.filter(d => d < 25).length
    },
    loadTimeDistribution: {
      fast: performanceStats.pageLoadTimes.filter(t => t < 3000).length,    // < 3s
      medium: performanceStats.pageLoadTimes.filter(t => t >= 3000 && t < 10000).length, // 3-10s
      slow: performanceStats.pageLoadTimes.filter(t => t >= 10000).length   // > 10s
    }
  };
}

// Data Quality Assessment
function calculateDataQuality(data) {
  const totalRecords = data.pageViews.length + data.events.length + data.clicks.length;
  const validRecords = data.pageViews.filter(pv => pv.userAgent && pv.userAgent !== 'Unknown').length +
                      data.events.filter(e => e.timestamp).length +
                      data.clicks.filter(c => c.timestamp).length;
  
  const qualityScore = totalRecords > 0 ? (validRecords / totalRecords * 100).toFixed(1) : 0;
  
  return {
    score: parseFloat(qualityScore),
    totalRecords,
    validRecords,
    completeness: qualityScore + '%',
    recommendations: qualityScore < 80 ? ['Improve data collection', 'Check tracking implementation'] : ['Good data quality']
  };
}

module.exports = {
  loadAnalytics,
  saveAnalytics,
  addPageView,
  addEvent,
  addClick,
  getBasicStats,
  getPopularPages,
  getTrafficSources,
  getHeatmapData,
  getEngagementMetrics,
  getCTRData,
  getDeviceAnalytics,
  getSocialSharingStats,
  getRealTimeStats,
  getHourlyTrafficAnalysis,
  getEnhancedDeviceAnalytics,
  getViewportAnalytics,
  getBrowserAnalytics,
  getPerformanceMetrics,
  calculateDataQuality,
  filterDataByPeriod,
  detectDeviceType
};
