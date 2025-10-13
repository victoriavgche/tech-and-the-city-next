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
    
    console.log('📨 Analytics POST received:', JSON.stringify(body, null, 2));
    
    if (body.type === 'pageview') {
      if (!body.url || !body.title) {
        console.error('❌ Missing required pageview fields:', body);
        return NextResponse.json({ error: 'Missing required fields: url and title' }, { status: 400 });
      }
      
      const success = addPageView(
        body.url, 
        body.title, 
        body.referrer || '', 
        body.userAgent || 'Unknown',
        body.sessionId || 'unknown',
        body.viewport || { width: 0, height: 0 },
        body.screen || { width: 0, height: 0 },
        body.devicePixelRatio || 1,
        body.language || 'en',
        body.platform || 'unknown'
      );
      if (success) {
        console.log('✅ Analytics POST: Successfully saved pageview data');
        return NextResponse.json({ success: true });
      } else {
        console.error('❌ Failed to save pageview data');
        return NextResponse.json({ error: 'Failed to save pageview' }, { status: 500 });
      }
    } else if (body.type === 'event') {
      if (!body.eventType) {
        console.error('❌ Missing eventType field:', body);
        return NextResponse.json({ error: 'Missing required field: eventType' }, { status: 400 });
      }
      
      const success = addEvent(body.eventType, body.eventData || {});
      if (success) {
        console.log('✅ Analytics POST: Successfully saved event data');
        
        // If it's a social share event, also save it to socialShares array
        if (body.eventType === 'social_share' && body.eventData) {
          const data = loadAnalytics();
          if (!data.socialShares) data.socialShares = [];
          
          data.socialShares.push({
            platform: body.eventData.platform || 'unknown',
            url: body.eventData.url || '',
            title: body.eventData.title || 'Unknown',
            timestamp: body.eventData.timestamp || new Date().toISOString()
          });
          
          saveAnalytics(data);
          console.log('✅ Analytics POST: Successfully saved social share data');
        }
        
        return NextResponse.json({ success: true });
      } else {
        console.error('❌ Failed to save event data');
        return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
      }
    } else if (body.type === 'click') {
      if (!body.url) {
        console.error('❌ Missing url field for click:', body);
        return NextResponse.json({ error: 'Missing required field: url' }, { status: 400 });
      }
      
      const success = addClick(
        body.url, 
        body.x || 0, 
        body.y || 0, 
        body.element || 'unknown', 
        body.userAgent || 'Unknown'
      );
      if (success) {
        console.log('✅ Analytics POST: Successfully saved click data');
        return NextResponse.json({ success: true });
      } else {
        console.error('❌ Failed to save click data');
        return NextResponse.json({ error: 'Failed to save click' }, { status: 500 });
      }
    }
    
    console.error('❌ Invalid request type:', body.type);
    return NextResponse.json({ error: `Invalid request type: ${body.type}` }, { status: 400 });
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
