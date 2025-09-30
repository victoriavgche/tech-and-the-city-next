import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    console.log('Status update request for slug:', slug);
    
    const body = await request.json();
    const { status } = body;
    console.log('Requested status change:', { status, body });
    
    if (!status || !['draft', 'published'].includes(status)) {
      console.error('Invalid status:', status);
      return Response.json({ error: 'Invalid status. Must be "draft" or "published"' }, { status: 400 });
    }
    
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    console.log('File path:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('Post file not found:', filePath);
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Read current file
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    console.log('Current post data:', { title: data.title, currentStatus: data.status });
    
    // Update status
    data.status = status;
    
    // Rebuild front matter with better handling
    const frontMatter = `---
title: "${(data.title || '').replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"')}"
date: "${data.date || new Date().toISOString()}"
tags:
${data.tags && Array.isArray(data.tags) ? data.tags.map(tag => `  - ${tag}`).join('\n') : '  - AI\n  - Technology\n  - Athens'}
read: "${data.read || '5 min'}"
${data.image ? `image: "${data.image}"` : ''}
status: "${status}"
---

${content}`;
    
    console.log('Writing updated file with status:', status);
    
    // Write updated file
    await fs.writeFile(filePath, frontMatter, 'utf8');
    
    console.log('Status update successful');
    return Response.json({ success: true, status, slug });
  } catch (error) {
    console.error('Error updating post status:', error);
    return Response.json({ 
      error: 'Failed to update post status', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
