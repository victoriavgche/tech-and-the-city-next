import { NextResponse } from 'next/server';
import { addAnalyticsEntry, getAnalyticsData, getAllTimeStats, cleanupOldAnalyticsData, trackUniqueUserActivity } from '../../../lib/analytics-storage';

export async function POST(request) {
  try {
    // Check if request has body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      console.log('Analytics POST: Empty request body');
      return NextResponse.json({ success: true, message: 'Empty request ignored' });
    }

    const body = await request.text();
    if (!body || body.trim() === '') {
      console.log('Analytics POST: Empty body text');
      return NextResponse.json({ success: true, message: 'Empty body ignored' });
    }

    const { type, data } = JSON.parse(body);
    
    // Validate required fields
    if (!type) {
      console.log('Analytics POST: Missing type field');
      return NextResponse.json({ success: true, message: 'Missing type ignored' });
    }
    
    // Add timestamp if not present
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }
    
    // Save to file storage
    const success = addAnalyticsEntry(type, data);
    
    // Track unique user activity for pageviews
    if (success && type === 'pageview' && data) {
      try {
        trackUniqueUserActivity(data);
      } catch (error) {
        console.error('Error tracking unique user activity:', error);
      }
    }
    
    if (success) {
      console.log(`Analytics POST: Successfully saved ${type} data`);
      
      // Keep all historical data - no automatic cleanup
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save analytics data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}

export async function GET(request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const period = searchParams.get('period') || '7d'; // 1d, 7d, 30d, 90d, all
    
    // Use file-based storage for data retrieval
    const data = getAnalyticsData(type, period);
    
    if (data.error) {
      return NextResponse.json(data, { status: 400 });
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`Analytics GET: ${type} (${period}) processed in ${processingTime}ms`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
