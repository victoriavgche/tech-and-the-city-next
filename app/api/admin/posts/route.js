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
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
