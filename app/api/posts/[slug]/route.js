import { getPostBySlug } from '../../../../lib/posts';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
