import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const postsDir = path.join(process.cwd(), 'content', 'posts');

export async function POST(request) {
  try {
    const { title, excerpt, content, date, image } = await request.json();

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create markdown content
    const markdownContent = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
${image ? `image: "${image}"` : ''}
---

${content}`;

    // Write file
    const filePath = path.join(postsDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdownContent, 'utf8');

    return NextResponse.json({ 
      success: true, 
      slug,
      message: 'Article created successfully' 
    });

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
