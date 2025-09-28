import { NextResponse } from 'next/server';
import { getEnhancedAnalyticsSummary } from '../../../../lib/analytics-storage';

export async function GET(request) {
  try {
    const enhancedData = getEnhancedAnalyticsSummary();
    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error('Enhanced analytics GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch enhanced analytics' }, { status: 500 });
  }
}
