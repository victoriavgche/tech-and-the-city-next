import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { githubAdmin } from '../../../../lib/github-admin';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse front matter
    const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontMatterMatch) {
      const frontMatter = frontMatterMatch[1];
      const content = frontMatterMatch[2];
      
      // Parse front matter fields with better regex
      const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);
      const excerptMatch = frontMatter.match(/^excerpt:\s*(.+)$/m);
      const imageMatch = frontMatter.match(/^image:\s*(.+)$/m);
      const dateMatch = frontMatter.match(/^date:\s*(.+)$/m);
      
      return NextResponse.json({
        title: titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '') : '',
        excerpt: excerptMatch ? excerptMatch[1].replace(/^["']|["']$/g, '') : '',
        body: content,
        content: content,
        image: imageMatch ? imageMatch[1].replace(/^["']|["']$/g, '') : '',
        featuredImage: imageMatch ? imageMatch[1].replace(/^["']|["']$/g, '') : '',
        date: dateMatch ? dateMatch[1].replace(/^["']|["']$/g, '') : new Date().toISOString()
      });
    } else {
      // Fallback for files without front matter
      return NextResponse.json({
        title: '',
        excerpt: '',
        body: fileContent,
        content: fileContent,
        image: '',
        featuredImage: '',
        date: new Date().toISOString()
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { title, excerpt, content, featuredImage, date } = body;
    
    console.log(`Attempting to update post: ${slug}`);
    console.log(`Title: ${title}`);
    console.log(`Excerpt: ${excerpt}`);
    console.log(`Content length: ${content ? content.length : 'undefined'}`);
    console.log(`Featured Image: ${featuredImage}`);
    
    // Validate required fields
    if (!title || !content) {
      console.error('Missing required fields:', { title: !!title, content: !!content });
      return NextResponse.json({ 
        error: 'Title and content are required',
        received: { title: !!title, content: !!content }
      }, { status: 400 });
    }

    // Check if we're in a read-only environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.warn('⚠️  Production environment detected - filesystem is read-only');
      return NextResponse.json({ 
        error: '🚫 Admin features are disabled in production',
        details: 'The admin panel only works in local development. In production, the filesystem is read-only. To manage content, please:\n1. Run the site locally (npm run dev)\n2. Make your changes in the admin panel\n3. Commit and push your changes to GitHub\n4. Vercel will automatically deploy the updates',
        suggestion: 'Consider using a headless CMS (like Contentful, Sanity, or Strapi) for production content management.'
      }, { status: 403 });
    }
    
    // File system approach (only works in development)
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    console.log(`Posts directory: ${postsDir}`);
    console.log(`File path: ${filePath}`);
    
    // Check if directory exists
    if (!fs.existsSync(postsDir)) {
      console.log(`Creating directory: ${postsDir}`);
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // Directory exists, proceed with writing
    console.log('Directory exists, proceeding with file write');
    
    // Create markdown content with front matter
    const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString()}"
excerpt: "${excerpt ? excerpt.replace(/"/g, '\\"') : ''}"
tags:
  - AI
  - Technology
  - Athens
read: "5 min"${featuredImage ? `
image: "${featuredImage}"` : ''}
status: "published"
---

${content}`;
    
    // Write file
    console.log(`Writing to file: ${filePath}`);
    
    try {
      fs.writeFileSync(filePath, frontMatter, 'utf8');
      console.log('✅ File write completed');
      
      const writtenContent = fs.readFileSync(filePath, 'utf8');
      console.log(`File written successfully. Size: ${writtenContent.length} characters`);
      
      return NextResponse.json({ 
        success: true,
        message: `Post ${slug} updated successfully`,
        size: writtenContent.length,
        slug: slug
      });
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json({ 
        error: 'Failed to write file',
        details: writeError.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error updating post:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to update post', 
      details: error.message,
      type: error.name
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    console.log('Delete request for slug:', slug);

    // Check if we're in a read-only environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.warn('⚠️  Production environment detected - filesystem is read-only');
      return NextResponse.json({ 
        error: '🚫 Admin features are disabled in production',
        details: 'The admin panel only works in local development. In production, the filesystem is read-only. To manage content, please:\n1. Run the site locally (npm run dev)\n2. Make your changes in the admin panel\n3. Commit and push your changes to GitHub\n4. Vercel will automatically deploy the updates',
        suggestion: 'Consider using a headless CMS (like Contentful, Sanity, or Strapi) for production content management.'
      }, { status: 403 });
    }
    
    // File system approach (only works in development)
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    console.log('Attempting to delete file:', filePath);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('✅ File deleted successfully:', filePath);
        return NextResponse.json({ success: true, message: 'Post deleted successfully' });
      } catch (deleteError) {
        console.error('Error deleting file:', deleteError);
        return NextResponse.json({ 
          error: 'Failed to delete file',
          details: deleteError.message
        }, { status: 500 });
      }
    } else {
      console.error('File not found for deletion:', filePath);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ 
      error: 'Failed to delete post', 
      details: error.message 
    }, { status: 500 });
  }
}