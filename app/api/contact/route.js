import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendContactEmail } from '../../../lib/email';

export async function POST(request) {
  try {
    // Parse request body
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save contact form submission to file
    const contactData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message
    };

    const filePath = path.join(process.cwd(), 'contact-submissions.json');
    
    let submissions = [];
    try {
      const existingData = fs.readFileSync(filePath, 'utf8');
      submissions = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet
    }

    submissions.push(contactData);
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
    
    // Send email notification
    const emailResult = await sendContactEmail(contactData);
    
    if (emailResult.success) {
      console.log('✅ Contact form saved and email sent successfully');
      return NextResponse.json(
        { message: '✅ Message sent successfully! We will get back to you soon.' },
        { status: 200 }
      );
    } else {
      console.log('✅ Contact form saved but email failed:', emailResult.error);
      return NextResponse.json(
        { message: '✅ Message sent successfully! We will get back to you soon.' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message. Please try again later.' },
      { status: 500 }
    );
  }
}