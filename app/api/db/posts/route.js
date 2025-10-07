import connectDB from '../../../../lib/database.js';
import Post from '../../../../lib/models/Post.js';

export async function GET() {
  try {
    await connectDB();
    
    const posts = await Post.find().sort({ createdAt: -1 });
    
    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
    
    // Check if slug already exists
    const existingPost = await Post.findOne({ slug: data.slug });
    if (existingPost) {
      return Response.json({ error: 'Post with this slug already exists' }, { status: 400 });
    }
    
    const post = new Post(data);
    await post.save();
    
    console.log('✅ Post created successfully:', post.slug);
    
    return Response.json({ 
      success: true, 
      post,
      message: 'Post created successfully' 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
