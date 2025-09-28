import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

    // Try to send email via Gmail SMTP
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: 'techandthecity101@gmail.com',
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: 'Tech and the City <techandthecity101@gmail.com>',
        to: 'techandthecity101@gmail.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              📧 New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">👤 Contact Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">💬 Message:</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="font-size: 12px; color: #666; margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px;">
              <p>📅 <strong>Received:</strong> ${new Date().toLocaleString()}</p>
              <p>🌐 <strong>From:</strong> Tech and the City Contact Form</p>
              <p>↩️ <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully');

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      
      // Fallback: Save to file
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
      
      console.log('✅ Contact form saved to file');
    }

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