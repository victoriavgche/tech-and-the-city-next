import connectDB from '../../../../../../lib/database.js';
import Post from '../../../../../../lib/models/Post.js';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { status } = await request.json();
    
    if (!status || !['draft', 'published'].includes(status)) {
      return Response.json({ error: 'Invalid status. Must be "draft" or "published"' }, { status: 400 });
    }
    
    const post = await Post.findOneAndUpdate(
      { slug: params.slug },
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const action = status === 'published' ? 'published' : 'unpublished';
    console.log(`✅ Post ${action} successfully:`, post.slug);
    
    return Response.json({ 
      success: true, 
      status: post.status,
      slug: post.slug,
      message: `Post ${action} successfully`
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    return Response.json({ error: 'Failed to update post status' }, { status: 500 });
  }
}
