import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const postData = await request.json();
    
    if (!postData.title || !postData.content) {
      return Response.json({ error: 'Title and content are required' }, { status: 400 });
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
date: "${new Date().toISOString()}"
tags:
  - AI
  - Technology
  - Athens
read: "5 min"
${postData.featuredImage ? `image: "${postData.featuredImage}"` : ''}
---

${postData.content}`;

    // Write the file
    await fs.writeFile(filePath, frontMatter, 'utf8');
    
    return Response.json({ success: true, slug });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}