import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json({ content: fileContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { content } = body;
    
    console.log(`Attempting to update post: ${slug}`);
    console.log(`Content length: ${content ? content.length : 'undefined'}`);
    
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);
    
    console.log(`Posts directory: ${postsDir}`);
    console.log(`File path: ${filePath}`);
    
    // Validate content
    if (!content || typeof content !== 'string') {
      console.error('Invalid content provided:', { content: typeof content, length: content?.length });
      return NextResponse.json({ 
        error: 'Invalid content provided',
        received: typeof content,
        length: content?.length
      }, { status: 400 });
    }
    
    // Check if directory exists
    if (!fs.existsSync(postsDir)) {
      console.log(`Creating directory: ${postsDir}`);
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // Check if we can write to the directory
    try {
      const testFile = path.join(postsDir, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log('Directory is writable');
    } catch (writeError) {
      console.error('Directory is not writable:', writeError);
      return NextResponse.json({ 
        error: 'Cannot write to posts directory',
        details: writeError.message 
      }, { status: 500 });
    }
    
    // Write file
    console.log(`Writing to file: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
    
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
    const { slug } = params;
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