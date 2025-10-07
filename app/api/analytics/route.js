import { NextResponse } from 'next/server';
import { 
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
  loadAnalytics,
  saveAnalytics
} from '@/lib/analytics';

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (body.type === 'pageview') {
      const success = addPageView(
        body.url, 
        body.title, 
        body.referrer, 
        body.userAgent || 'Unknown',
        body.sessionId,
        body.viewport,
        body.screen,
        body.devicePixelRatio,
        body.language,
        body.platform
      );
      if (success) {
        console.log('Analytics POST: Successfully saved pageview data');
        return NextResponse.json({ success: true });
      }
    } else if (body.type === 'event') {
      const success = addEvent(body.eventType, body.eventData);
      if (success) {
        console.log('Analytics POST: Successfully saved event data');
        
        // If it's a social share event, also save it to socialShares array
        if (body.eventType === 'social_share' && body.eventData) {
          const data = loadAnalytics();
          if (!data.socialShares) data.socialShares = [];
          
          data.socialShares.push({
            platform: body.eventData.platform,
            url: body.eventData.url,
            title: body.eventData.title,
            timestamp: body.eventData.timestamp || new Date().toISOString()
          });
          
          saveAnalytics(data);
          console.log('Analytics POST: Successfully saved social share data');
        }
        
        return NextResponse.json({ success: true });
      }
    } else if (body.type === 'click') {
      const success = addClick(body.url, body.x, body.y, body.element, body.userAgent);
      if (success) {
        console.log('Analytics POST: Successfully saved click data');
        return NextResponse.json({ success: true });
      }
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'basic';
    const period = searchParams.get('period') || 'all';
    const url = searchParams.get('url');
    
    if (type === 'basic') {
      const stats = getBasicStats(period);
      console.log(`Analytics GET: basic stats processed for period ${period}`);
      return NextResponse.json(stats);
    } else if (type === 'popular') {
      const popular = getPopularPages(10, period);
      console.log(`Analytics GET: popular pages processed for period ${period}`);
      return NextResponse.json(popular);
    } else if (type === 'sources') {
      const sources = getTrafficSources(period);
      console.log(`Analytics GET: traffic sources processed for period ${period}`);
      return NextResponse.json(sources);
    } else if (type === 'heatmap' && url) {
      const heatmap = getHeatmapData(url);
      console.log('Analytics GET: heatmap data processed');
      return NextResponse.json(heatmap);
    } else if (type === 'engagement') {
      const engagement = getEngagementMetrics(period);
      console.log(`Analytics GET: engagement metrics processed for period ${period}`);
      return NextResponse.json(engagement);
    } else if (type === 'ctr') {
      const ctr = getCTRData(period);
      console.log(`Analytics GET: CTR data processed for period ${period}`);
      return NextResponse.json(ctr);
    } else if (type === 'devices') {
      const devices = getDeviceAnalytics(period);
      console.log(`Analytics GET: device analytics processed for period ${period}`);
      return NextResponse.json(devices);
    } else if (type === 'social') {
      const social = getSocialSharingStats(period);
      console.log(`Analytics GET: social sharing stats processed for period ${period}`);
      return NextResponse.json(social);
    } else if (type === 'realtime') {
      const realtime = getRealTimeStats();
      console.log('Analytics GET: real-time stats processed');
      return NextResponse.json(realtime);
    } else if (type === 'hourly') {
      const hourly = getHourlyTrafficAnalysis(period);
      console.log(`Analytics GET: hourly traffic analysis processed for period ${period}`);
      return NextResponse.json(hourly);
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
