import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { githubAdmin } from '@/lib/github-admin.js';

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 STATUS UPDATE REQUEST');
    console.log('Slug:', slug);
    
    const body = await request.json();
    const { status } = body;
    console.log('Requested status:', status);
    
    // Validate status
    if (!status || !['draft', 'published'].includes(status)) {
      console.error('❌ Invalid status:', status);
      return Response.json({ 
        error: 'Invalid status. Must be "draft" or "published"',
        receivedStatus: status
      }, { status: 400 });
    }

    // Check if in production and has GitHub access
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction && githubAdmin.hasGitHubAccess()) {
      console.log('🚀 Production mode: Attempting GitHub API update');
      const result = await githubAdmin.updatePostStatus(slug, status);
      
      if (result.success) {
        console.log('✅ GitHub update successful');
        return Response.json({ 
          success: true, 
          status, 
          slug,
          message: `Post status updated to ${status} via GitHub`,
          method: 'github'
        });
      } else if (result.error) {
        console.error('⚠️  GitHub status update failed:', result.error);
        console.log('📁 Falling back to filesystem approach');
        // Fall through to filesystem approach
      }
    } else {
      console.log('💻 Development mode or no GitHub access');
    }
    
    // Development mode or fallback: Use filesystem
    console.log('📁 Using filesystem approach');
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    console.log('File path:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
      console.log('✓ File exists');
    } catch (error) {
      console.error('❌ Post file not found:', filePath);
      return Response.json({ 
        error: 'Post not found',
        slug: slug,
        path: filePath
      }, { status: 404 });
    }
    
    // Read current file
    console.log('📖 Reading file...');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    console.log('Current post:', { 
      title: data.title, 
      currentStatus: data.status,
      newStatus: status
    });
    
    // Update status in data
    data.status = status;
    
    // Rebuild front matter preserving all fields
    let tagsSection = '';
    if (data.tags && Array.isArray(data.tags)) {
      tagsSection = `tags:\n${data.tags.map(tag => `  - ${tag}`).join('\n')}`;
    } else {
      tagsSection = `tags:\n  - AI\n  - Technology\n  - Athens`;
    }
    
    // Build complete front matter
    let frontMatterLines = [];
    frontMatterLines.push('---');
    frontMatterLines.push(`title: "${(data.title || '').replace(/"/g, '\\"')}"`);
    frontMatterLines.push(`excerpt: "${(data.excerpt || '').replace(/"/g, '\\"')}"`);
    frontMatterLines.push(`date: "${data.date || new Date().toISOString()}"`);
    frontMatterLines.push(tagsSection);
    frontMatterLines.push(`read: "${data.read || '5 min'}"`);
    if (data.image) {
      frontMatterLines.push(`image: "${data.image}"`);
    }
    frontMatterLines.push(`status: "${status}"`);
    frontMatterLines.push('---');
    frontMatterLines.push('');
    
    const newFileContent = frontMatterLines.join('\n') + content;
    
    console.log('💾 Writing updated file...');
    await fs.writeFile(filePath, newFileContent, 'utf8');
    
    // Verify the write
    const verifyContent = await fs.readFile(filePath, 'utf8');
    const verified = matter(verifyContent);
    console.log('✅ Status update verified:', verified.data.status);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return Response.json({ 
      success: true, 
      status: status,
      slug: slug,
      message: `Post status updated to ${status}`,
      method: 'filesystem'
    });
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR updating post status:', error);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return Response.json({ 
      error: 'Failed to update post status', 
      details: error.message,
      slug: params.slug
    }, { status: 500 });
  }
}
