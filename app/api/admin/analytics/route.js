import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { getAllPostsMeta } from '../../../../lib/posts';

export async function GET(request) {
  try {
    const session = requireAuth(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await getAllPostsMeta();
    
    // Mock analytics data (in production, you'd get this from a database)
    const analytics = {
      totalPosts: posts.length,
      totalViews: posts.reduce((sum, post) => sum + (post.views || Math.floor(Math.random() * 1000)), 0),
      popularPosts: posts.map(post => ({
        ...post,
        views: post.views || Math.floor(Math.random() * 1000)
      })).sort((a, b) => b.views - a.views).slice(0, 10)
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
