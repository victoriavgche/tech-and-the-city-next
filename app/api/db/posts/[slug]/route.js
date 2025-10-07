import connectDB from '../../../../../lib/database.js';
import Post from '../../../../../lib/models/Post.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const post = await Post.findOne({ slug: params.slug });
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    const post = await Post.findOneAndUpdate(
      { slug: params.slug },
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    console.log('✅ Post updated successfully:', post.slug);
    
    return Response.json({ 
      success: true, 
      post,
      message: 'Post updated successfully' 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const post = await Post.findOneAndDelete({ slug: params.slug });
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    console.log('✅ Post deleted successfully:', params.slug);
    
    return Response.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
