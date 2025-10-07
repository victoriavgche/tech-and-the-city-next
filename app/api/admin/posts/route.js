import { promises as fs } from 'fs';
import path from 'path';
// autoBackup removed - using simple backup system now

export async function POST(request) {
  try {
    const postData = await request.json();
    
    console.log('Received post data:', {
      title: postData.title,
      contentLength: postData.content?.length,
      excerpt: postData.excerpt,
      image: postData.image,
      date: postData.date,
      status: postData.status
    });
    
    if (!postData.title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }
    
    // Check if content has actual text (not just HTML tags)
    const textContent = postData.content ? postData.content.replace(/<[^>]*>/g, '').trim() : '';
    if (!textContent) {
      return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    // Check if we're in a read-only environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.warn('⚠️  Production environment detected - filesystem is read-only');
      return Response.json({ 
        error: '🚫 Admin features are disabled in production',
        details: 'The admin panel only works in local development. In production, the filesystem is read-only. To manage content, please:\n1. Run the site locally (npm run dev)\n2. Make your changes in the admin panel\n3. Commit and push your changes to GitHub\n4. Vercel will automatically deploy the updates',
        suggestion: 'Consider using a headless CMS (like Contentful, Sanity, or Strapi) for production content management.'
      }, { status: 403 });
    }
    
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    
    // Ensure posts directory exists
    try {
      await fs.access(postsDirectory);
    } catch (error) {
      await fs.mkdir(postsDirectory, { recursive: true });
    }
    
    // Generate slug from title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      return Response.json({ error: 'Article with this title already exists' }, { status: 409 });
    } catch (error) {
      // File doesn't exist, we can create it
    }
    
    // Create front matter
    const frontMatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
excerpt: "${postData.excerpt ? postData.excerpt.replace(/"/g, '\\"') : ''}"
date: "${postData.date || new Date().toISOString()}"
tags:
  - AI
  - Technology
  - Athens
read: "5 min"
${postData.image ? `image: "${postData.image}"` : ''}
${postData.status ? `status: "${postData.status}"` : ''}
---

${postData.content}`;

    // Write the file
    await fs.writeFile(filePath, frontMatter, 'utf8');
    console.log('✅ Post created successfully:', slug);
    
    return Response.json({ success: true, slug });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post', details: error.message }, { status: 500 });
  }
}