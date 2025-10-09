import { NextResponse } from 'next/server';
import { getArticleBySlug } from '../../../../lib/articles';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const post = await getArticleBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}