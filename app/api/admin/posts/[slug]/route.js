import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await params;
    const { slug } = resolvedParams;
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
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();
    const { title, excerpt, content, featuredImage, date } = body;
    
    console.log(`Attempting to update post: ${slug}`);
    console.log(`Title: ${title}`);
    console.log(`Excerpt: ${excerpt}`);
    console.log(`Content length: ${content ? content.length : 'undefined'}`);
    console.log(`Featured Image: ${featuredImage}`);
    
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    console.log(`Posts directory: ${postsDir}`);
    console.log(`File path: ${filePath}`);
    
    // Validate required fields
    if (!title || !content) {
      console.error('Missing required fields:', { title: !!title, content: !!content });
      return NextResponse.json({ 
        error: 'Title and content are required',
        received: { title: !!title, content: !!content }
      }, { status: 400 });
    }
    
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
excerpt: "${excerpt ? excerpt.replace(/"/g, '\\"') : ''}"${featuredImage ? `
image: "${featuredImage}"` : ''}
---

${content}`;
    
    // Write file
    console.log(`Writing to file: ${filePath}`);
    fs.writeFileSync(filePath, frontMatter, 'utf8');
    
    // Verify file was written
    if (fs.existsSync(filePath)) {
      const writtenContent = fs.readFileSync(filePath, 'utf8');
      console.log(`File written successfully. Size: ${writtenContent.length} characters`);
      return NextResponse.json({ 
        success: true,
        message: `Post ${slug} updated successfully`,
        size: writtenContent.length
      });
    } else {
      console.error('File was not created');
      return NextResponse.json({ 
        error: 'File was not created' 
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
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}