import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const fileName = `${baseName}-${timestamp}${extension}`;
    
    const filePath = path.join(uploadsDir, fileName);
    
    // Write file
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;
    
    console.log(`File uploaded: ${fileName}`);
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName,
      size: buffer.length
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error.message 
    }, { status: 500 });
  }
}
