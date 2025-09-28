import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    
    console.log('✅ Contact form saved successfully');
    console.log('📧 EMAIL DETAILS FOR MANUAL SENDING:');
    console.log('📧 To: techandthecity101@gmail.com');
    console.log('📧 From: ' + email);
    console.log('📧 Subject: Contact Form: ' + subject);
    console.log('📧 Message: ' + message);
    console.log('📧 =====================================');

    return NextResponse.json(
      { message: 'Message received successfully! We will get back to you soon.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message. Please try again later.' },
      { status: 500 }
    );
  }
}