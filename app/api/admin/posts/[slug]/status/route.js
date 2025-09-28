import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const { status } = await request.json();
    
    if (!status || !['draft', 'published'].includes(status)) {
      return Response.json({ error: 'Invalid status. Must be "draft" or "published"' }, { status: 400 });
    }
    
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Read current file
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Update status
    data.status = status;
    
    // Rebuild front matter
    const frontMatter = `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${data.excerpt ? data.excerpt.replace(/"/g, '\\"') : ''}"
date: "${data.date}"
tags:
${data.tags ? data.tags.map(tag => `  - ${tag}`).join('\n') : '  - AI\n  - Technology\n  - Athens'}
read: "${data.read || '5 min'}"
${data.image ? `image: "${data.image}"` : ''}
status: "${status}"
---

${content}`;
    
    // Write updated file
    await fs.writeFile(filePath, frontMatter, 'utf8');
    
    return Response.json({ success: true, status });
  } catch (error) {
    console.error('Error updating post status:', error);
    return Response.json({ error: 'Failed to update post status' }, { status: 500 });
  }
}
