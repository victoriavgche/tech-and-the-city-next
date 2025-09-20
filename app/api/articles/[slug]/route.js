import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content', 'posts');

// GET - Load article for editing
export async function GET(request, { params }) {
  try {
    const file = path.join(postsDir, `${params.slug}.md`);
    
    if (!fs.existsSync(file)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);

    return NextResponse.json({
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      image: data.image || '',
      content: content
    });

  } catch (error) {
    console.error('Error loading article:', error);
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }
}

// PUT - Update article
export async function PUT(request, { params }) {
  try {
    const { title, excerpt, content, date, image } = await request.json();

    if (!title || !excerpt || !date || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const file = path.join(postsDir, `${params.slug}.md`);
    
    if (!fs.existsSync(file)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Create markdown content
    const markdownContent = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
${image ? `image: "${image}"` : ''}
---

${content}
`;

    // Write file
    fs.writeFileSync(file, markdownContent, 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: 'Article updated successfully' 
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(request, { params }) {
  try {
    const file = path.join(postsDir, `${params.slug}.md`);
    
    if (!fs.existsSync(file)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    fs.unlinkSync(file);

    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

