import { getAllPostsMeta } from '../../../../lib/posts';
import { githubAdmin } from '@/lib/github-admin.js';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Admin needs to see ALL posts (published and drafts)
    const allPosts = await getAllPostsMeta();
    return Response.json(allPosts);
  } catch (error) {
    console.error('Error fetching all posts for admin:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

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

    // Generate slug from title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if in production
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('🚀 Production mode detected');
      if (githubAdmin.hasGitHubAccess()) {
        console.log('✅ GitHub access available, using GitHub API');
        const result = await githubAdmin.createPost(postData);
        
        if (result.success) {
          return Response.json({ 
            success: true, 
            slug: result.slug || slug,
            method: 'github'
          });
        } else {
          console.error('⚠️  GitHub create failed:', result.error);
          return Response.json({ 
            error: 'Failed to create post in production',
            details: result.error || 'GitHub API error',
            suggestion: 'Check GitHub token configuration'
          }, { status: 500 });
        }
      } else {
        console.error('❌ No GitHub access in production');
        return Response.json({ 
          error: 'Cannot create posts in production',
          details: 'GitHub integration not configured',
          suggestion: 'Set GITHUB_TOKEN environment variable'
        }, { status: 503 });
      }
    } else {
      console.log('💻 Development mode: Using filesystem');
    }
    
    // Development mode or fallback: Use filesystem
    console.log('💻 Development mode: Using filesystem');
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    
    // Ensure posts directory exists
    try {
      await fs.access(postsDirectory);
    } catch (error) {
      await fs.mkdir(postsDirectory, { recursive: true });
    }
    
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      return Response.json({ error: 'Article with this title already exists' }, { status: 409 });
    } catch (error) {
      // File doesn't exist, we can create it
    }
    
    // Create front matter with proper status handling
    const status = postData.status || 'published'; // Default to published if not specified
    const frontMatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
excerpt: "${postData.excerpt ? postData.excerpt.replace(/"/g, '\\"') : ''}"
date: "${postData.date || new Date().toISOString()}"
tags:
  - AI
  - Technology
  - Athens
read: "5 min"${postData.image ? `
image: "${postData.image}"` : ''}
status: "${status}"
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