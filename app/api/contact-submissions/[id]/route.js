import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await params;
    const messageId = parseInt(resolvedParams.id);
    
    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'contact-submissions.json');
    
    let messages = [];
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      messages = JSON.parse(data);
    } catch (error) {
      return NextResponse.json(
        { error: 'No messages found' },
        { status: 404 }
      );
    }

    // Remove message by index
    if (messageId < 0 || messageId >= messages.length) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    messages.splice(messageId, 1);
    
    // Save updated messages
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
