import { getAllPostsMeta } from '../../../lib/posts';

export async function GET() {
  try {
    const posts = await getAllPostsMeta();
    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
