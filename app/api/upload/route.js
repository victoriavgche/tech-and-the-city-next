import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    console.log('Upload API called');
    
    const data = await request.formData();
    const file = data.get('file');
    
    console.log('File received:', file ? file.name : 'No file');
    
    if (!file) {
      console.log('No file in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('Uploads directory:', uploadsDir);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Directory created/verified');
    } catch (error) {
      console.log('Directory error:', error.message);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${baseName}-${timestamp}${extension}`;
    
    const filePath = path.join(uploadsDir, fileName);
    console.log('File path:', filePath);
    
    // Write file
    await writeFile(filePath, buffer);
    console.log('File written successfully');
    
    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;
    
    console.log(`File uploaded successfully: ${fileName}`);
    
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
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
