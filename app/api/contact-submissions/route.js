import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'contact-submissions.json');
    
    let messages = [];
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      messages = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
      return NextResponse.json([]);
    }

    // Add unique IDs to messages
    const messagesWithIds = messages.map((message, index) => ({
      ...message,
      id: index
    }));

    return NextResponse.json(messagesWithIds);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');
    
    if (messageId === null) {
      return NextResponse.json(
        { error: 'Message ID is required' },
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
    const messageIndex = parseInt(messageId);
    if (messageIndex < 0 || messageIndex >= messages.length) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    messages.splice(messageIndex, 1);
    
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
