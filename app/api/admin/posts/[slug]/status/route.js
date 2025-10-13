import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function PUT(request, { params }) {
  try {
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();
    const { status } = body;
    
    console.log('PUT request received for slug:', slug, 'with status:', status);
    
    if (!status || !['draft', 'published'].includes(status)) {
      console.error('Invalid status:', status);
      return NextResponse.json({ error: 'Invalid status. Must be "draft" or "published"' }, { status: 400 });
    }
    
    const postsDirectory = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    console.log('File path:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('File not found:', filePath);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Read current file
    const fileContent = await fs.readFile(filePath, 'utf8');
    console.log('File read successfully, length:', fileContent.length);
    
    // Parse with gray-matter
    const parsed = matter(fileContent);
    console.log('Parsed front matter:', parsed.data);
    
    // Update status in the data
    parsed.data.status = status;
    
    // Use gray-matter to stringify back
    const updatedContent = matter.stringify(parsed.content, parsed.data);
    console.log('Updated content generated, length:', updatedContent.length);
    
    // Write updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log('File written successfully');
    
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating post status:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: 'Failed to update post status', details: error.message }, { status: 500 });
  }
}
