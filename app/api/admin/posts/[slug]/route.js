import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { githubAdmin } from '@/lib/github-admin.js';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 GET POST REQUEST');
    console.log('Slug:', slug);
    
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    console.log('File path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ Post not found:', filePath);
      return NextResponse.json({ error: 'Post not found', slug }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('✓ File read successfully, length:', fileContent.length);
    
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
      const statusMatch = frontMatter.match(/^status:\s*(.+)$/m);
      
      const postData = {
        slug: slug,
        title: titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '') : '',
        excerpt: excerptMatch ? excerptMatch[1].replace(/^["']|["']$/g, '') : '',
        body: content,
        content: content,
        image: imageMatch ? imageMatch[1].replace(/^["']|["']$/g, '') : '',
        featuredImage: imageMatch ? imageMatch[1].replace(/^["']|["']$/g, '') : '',
        date: dateMatch ? dateMatch[1].replace(/^["']|["']$/g, '') : new Date().toISOString(),
        status: statusMatch ? statusMatch[1].replace(/^["']|["']$/g, '') : 'published'
      };
      
      console.log('Post data:', {
        title: postData.title,
        status: postData.status,
        contentLength: postData.content.length
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return NextResponse.json(postData);
    } else {
      // Fallback for files without front matter
      console.log('⚠️  No front matter found, using defaults');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return NextResponse.json({
        slug: slug,
        title: '',
        excerpt: '',
        body: fileContent,
        content: fileContent,
        image: '',
        featuredImage: '',
        date: new Date().toISOString(),
        status: 'published'
      });
    }
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR fetching post:', error);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return NextResponse.json({ 
      error: 'Failed to fetch post',
      details: error.message,
      slug: params.slug
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { title, excerpt, content, featuredImage, date } = body;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 PUT (UPDATE) POST REQUEST');
    console.log(`Slug: ${slug}`);
    console.log(`Title: ${title}`);
    console.log(`Excerpt: ${excerpt}`);
    console.log(`Content length: ${content ? content.length : 'undefined'}`);
    console.log(`Featured Image: ${featuredImage}`);
    console.log(`Date: ${date}`);
    
    // Validate required fields
    if (!title || !content) {
      console.error('❌ Missing required fields:', { title: !!title, content: !!content });
      return NextResponse.json({ 
        error: 'Title and content are required',
        received: { title: !!title, content: !!content }
      }, { status: 400 });
    }

    // Read existing file to preserve status and other fields
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    let existingStatus = 'published'; // Default
    let existingTags = ['AI', 'Technology', 'Athens']; // Default
    let existingRead = '5 min'; // Default
    
    // Try to read existing file to preserve fields
    if (fs.existsSync(filePath)) {
      console.log('📖 Reading existing file to preserve fields...');
      const existingContent = fs.readFileSync(filePath, 'utf8');
      const frontMatterMatch = existingContent.match(/^---\n([\s\S]*?)\n---\n/);
      
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        const statusMatch = frontMatter.match(/^status:\s*(.+)$/m);
        const tagsMatch = frontMatter.match(/^tags:\s*\n((?:  - .+\n?)*)/m);
        const readMatch = frontMatter.match(/^read:\s*(.+)$/m);
        
        if (statusMatch) {
          existingStatus = statusMatch[1].replace(/^["']|["']$/g, '');
          console.log('✓ Preserved status:', existingStatus);
        }
        
        if (tagsMatch) {
          const tagsContent = tagsMatch[1];
          existingTags = tagsContent.split('\n')
            .filter(line => line.trim().startsWith('- '))
            .map(line => line.trim().substring(2))
            .filter(Boolean);
          console.log('✓ Preserved tags:', existingTags);
        }
        
        if (readMatch) {
          existingRead = readMatch[1].replace(/^["']|["']$/g, '');
          console.log('✓ Preserved read time:', existingRead);
        }
      }
    }

    // Check if in production and try GitHub first
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction && githubAdmin.hasGitHubAccess()) {
      console.log('🚀 Production mode: Using GitHub API');
      const result = await githubAdmin.updatePost(slug, {
        title,
        excerpt,
        content,
        image: featuredImage,
        date,
        status: existingStatus
      });
      
      if (result.success) {
        console.log('✅ GitHub update successful');
        return NextResponse.json({ 
          success: true,
          message: result.message,
          slug: slug,
          method: 'github',
          status: existingStatus
        });
      } else {
        console.error('⚠️  GitHub update failed, falling back to filesystem');
      }
    }
    
    // Development mode or fallback: Use filesystem
    console.log('📁 Using filesystem approach');
    
    console.log(`Posts directory: ${postsDir}`);
    console.log(`File path: ${filePath}`);
    
    // Check if directory exists
    if (!fs.existsSync(postsDir)) {
      console.log(`Creating directory: ${postsDir}`);
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // Build tags section
    const tagsSection = existingTags.map(tag => `  - ${tag}`).join('\n');
    
    // Create markdown content with front matter preserving status
    const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${excerpt ? excerpt.replace(/"/g, '\\"') : ''}"
date: "${date || new Date().toISOString()}"
tags:
${tagsSection}
read: "${existingRead}"${featuredImage ? `
image: "${featuredImage}"` : ''}
status: "${existingStatus}"
---

${content}`;
    
    // Write file
    console.log(`💾 Writing to file: ${filePath}`);
    console.log(`Status being saved: ${existingStatus}`);
    fs.writeFileSync(filePath, frontMatter, 'utf8');
    console.log('✅ File write completed');
    
    // Verify the write
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    const verifyMatch = writtenContent.match(/^status:\s*"(.+)"$/m);
    const verifiedStatus = verifyMatch ? verifyMatch[1] : 'unknown';
    console.log(`✅ Verified status in file: ${verifiedStatus}`);
    console.log(`File size: ${writtenContent.length} characters`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json({ 
      success: true,
      message: `Post ${slug} updated successfully`,
      size: writtenContent.length,
      slug: slug,
      status: existingStatus,
      method: 'filesystem'
    });
    
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR updating post:', error);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return NextResponse.json({ 
      error: 'Failed to update post', 
      details: error.message,
      type: error.name,
      slug: params.slug
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    console.log('Delete request for slug:', slug);

    // Check if in production and has GitHub access
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction && githubAdmin.hasGitHubAccess()) {
      console.log('🚀 Production mode: Using GitHub API');
      const result = await githubAdmin.deletePost(slug);
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: result.message 
        });
      } else if (result.error) {
        return NextResponse.json(result, { status: 503 });
      }
    }
    
    // Development mode or fallback: Use filesystem
    console.log('💻 Development mode: Using filesystem');
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    console.log('Attempting to delete file:', filePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ File deleted successfully:', filePath);
      return NextResponse.json({ success: true, message: 'Post deleted successfully' });
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