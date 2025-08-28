// app/api/send-email/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; 
  message: string;
}

export async function POST(request: Request) {
  const { GMAIL_EMAIL, GMAIL_APP_PASSWORD, OWNER_EMAIL } = process.env;

  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD || !OWNER_EMAIL) {
    console.error("Server Error: Missing one or more required environment variables for email.");
    return NextResponse.json(
      { error: 'Server is not configured correctly to send emails.' },
      { status: 500 } // 500 Internal Server Error
    );
  }

  try {
    const { firstName, lastName, email, phone, message }: ContactFormData = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const ownerMailOptions = {
      from: OWNER_EMAIL, 
      to: OWNER_EMAIL,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      replyTo: email, 
      html: `
        <h2>New Message from Your Website's Contact Form</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    const userMailOptions = {
      from: `"Amsa Overseas" <${OWNER_EMAIL}>`, 
      to: email,
      subject: `We've Received Your Message!`,
      html: `
        <h2>Thank you for contacting us, ${firstName}!</h2>
        <p>We have successfully received your message and will get back to you as soon as possible.</p>
        <p>Here is a copy of your submission:</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; margin-left: 0;">
          <p><strong>Message:</strong> ${message.replace(/\n/g, '<br>')}</p>
        </blockquote>
        <p>Best regards,</p>
        <p>The Team at Amsa Overseas</p>
      `,
    };

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    
    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
