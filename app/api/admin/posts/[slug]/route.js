import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const postData = await request.json();
    
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Create front matter
    const frontMatter = `---
title: "${postData.title}"
excerpt: "${postData.excerpt}"
date: "${postData.date}"
tags:
  - AI
  - Technology
  - Athens
read: "${postData.read || '5 min'}"
image: "${postData.image || ''}"
---

${postData.content}`;

    // Write the file
    await fs.writeFile(filePath, frontMatter, 'utf8');
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
