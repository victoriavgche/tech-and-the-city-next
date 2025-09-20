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
    
    const stats = {
      totalPosts: posts.length,
      recentPosts: posts.slice(0, 10).map(post => ({
        slug: post.slug,
        title: post.title,
        date: post.date
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
