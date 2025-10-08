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

    // Check if in production
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('🚀 Production mode detected');
      if (githubAdmin.hasGitHubAccess()) {
        console.log('✅ GitHub access available, using GitHub API');
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
        } else {
          console.error('⚠️  GitHub status update failed:', result.error);
          return Response.json({ 
            error: 'Failed to update post status in production',
            details: result.error || 'GitHub API error',
            suggestion: 'Check GitHub token configuration'
          }, { status: 500 });
        }
      } else {
        console.error('❌ No GitHub access in production');
        return Response.json({ 
          error: 'Cannot update post status in production',
          details: 'GitHub integration not configured',
          suggestion: 'Set GITHUB_TOKEN environment variable'
        }, { status: 503 });
      }
    } else {
      console.log('💻 Development mode: Using filesystem');
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
