// util/emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const createTransporter = () => {
  // Check if we have the necessary environment variables
  if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
    console.error('EMAIL or APP_PASSWORD environment variables are missing');
    throw new Error('Email configuration is incomplete');
  }

  console.log('Creating email transporter with:', process.env.EMAIL);
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Gmail email address
      pass: process.env.APP_PASSWORD, // Gmail app password
    },
    // Debug options to help identify issues
    debug: true,
    logger: true
  });
};

// Function to send an email. `attachments` follows nodemailer's format
// (e.g. [{ filename: 'receipt.pdf', content: bufferOrStream }]) and is
// optional — existing 3-argument callers are unaffected.
const sendEmail = async (to, subject, text, attachments = []) => {
  try {
    console.log(`Sending email to ${to} with subject "${subject}"`);

    // Create transporter for each email to avoid connection issues
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: `"Student Facility System" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      text: text,
      // Adding HTML version for better compatibility
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4a5568;">Student Facility System</h2>
        <p>${text}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #718096;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>`,
      attachments,
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully. Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
