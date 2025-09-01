import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, message } = await request.json();

    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 1. Email to the Website Owner
    const ownerMailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      replyTo: email,
      html: `
        <h2>New Message from Amsa Overseas Contact Form</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // 2. Beautiful Confirmation Email to the User
    const userMailOptions = {
      from: `"Amsa Overseas" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: `🚀 We've Got Your Message, ${firstName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          
          <div style="background-color: #4A90E2; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You For Reaching Out!</h1>
          </div>
          
          <div style="padding: 25px;">
            <h2 style="font-size: 20px; color: #4A90E2;">Hello ${firstName},</h2>
            <p>We're thrilled to hear from you! This is a quick confirmation that we have successfully received your message.</p>
            <p>Our team is on it and will get back to you within the next 24-48 hours. We appreciate your patience.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="font-weight: bold;">Here's a copy of your submission:</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #4A90E2; padding: 15px; margin-top: 15px;">
              <p style="margin: 0;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p style="margin-top: 25px;">In the meantime, feel free to check out our latest projects or follow us on social media!</p>
          </div>
          
          <div style="background-color: #f2f2f2; color: #777; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0 0;"><strong>The Team at Alphaseam Enterprises</strong></p>
          </div>
        </div>
      `,
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}