import { NextResponse } from 'next/server';
import { addAnalyticsEntry, getAnalyticsData, getAllTimeStats } from '../../../lib/analytics-storage';

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    
    // Add timestamp if not present
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }
    
    // Save to file storage
    const success = addAnalyticsEntry(type, data);
    
    if (success) {
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
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const period = searchParams.get('period') || '7d'; // 1d, 7d, 30d, 90d, all
    
    // Use file-based storage for data retrieval
    const data = getAnalyticsData(type, period);
    
    if (data.error) {
      return NextResponse.json(data, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
