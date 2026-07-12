// util/emailService.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// SendGrid sends over HTTPS (not raw SMTP), which is what Render's free tier
// blocks outbound — nodemailer + Gmail SMTP hung indefinitely there since
// the connection attempt was silently dropped rather than refused.
//
// Resend was tried first, but its sandbox mode (no verified domain) only
// allows sending to the email address the Resend account was created with —
// unusable for real registrations from arbitrary students. SendGrid's Single
// Sender Verification lets a verified sender email send to any recipient,
// with no domain purchase required.
const ensureConfigured = () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY environment variable is missing');
    throw new Error('Email configuration is incomplete');
  }
  if (!process.env.SENDGRID_FROM) {
    console.error('SENDGRID_FROM environment variable is missing');
    throw new Error('Email configuration is incomplete');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};

// Function to send an email. `attachments` follows nodemailer's format
// (e.g. [{ filename: 'receipt.pdf', content: bufferOrStream }]) and is
// optional — existing 3-argument callers are unaffected.
const sendEmail = async (to, subject, text, attachments = []) => {
  console.log(`Sending email to ${to} with subject "${subject}"`);

  ensureConfigured();

  const sgAttachments = attachments.map((a) => ({
    filename: a.filename,
    content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
    type: 'application/octet-stream',
    disposition: 'attachment',
  }));

  try {
    const [response] = await sgMail.send({
      from: process.env.SENDGRID_FROM,
      to,
      subject,
      text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4a5568;">Student Facility System</h2>
        <p>${text}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #718096;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>`,
      attachments: sgAttachments,
    });

    const messageId = response.headers['x-message-id'];
    console.log('Email sent successfully. Message ID:', messageId);
    return { success: true, messageId };
  } catch (error) {
    console.error('Error sending email:', error.response?.body || error.message);
    throw new Error(error.response?.body?.errors?.[0]?.message || error.message || 'Failed to send email');
  }
};

module.exports = sendEmail;

// ─── Previous implementation: Resend ────────────────────────────────────────
// Kept for reference — works fine on Render (HTTPS, not SMTP) but its free
// sandbox mode (no verified domain) can only send to the email address the
// Resend account was created with, which blocks real registrations from
// other students. Revisit this if a domain ever gets verified on Resend
// (resend.com/domains), since Resend's API/DX is otherwise simpler than
// SendGrid's. To switch back: comment out the SendGrid code above, uncomment
// this block, and set RESEND_API_KEY in the environment.
//
// const { Resend } = require('resend');
//
// const getResendClient = () => {
//   if (!process.env.RESEND_API_KEY) {
//     console.error('RESEND_API_KEY environment variable is missing');
//     throw new Error('Email configuration is incomplete');
//   }
//   return new Resend(process.env.RESEND_API_KEY);
// };
//
// const sendEmailViaResend = async (to, subject, text, attachments = []) => {
//   const resend = getResendClient();
//
//   const resendAttachments = attachments.map((a) => ({
//     filename: a.filename,
//     content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
//   }));
//
//   const { data, error } = await resend.emails.send({
//     from: process.env.RESEND_FROM || 'Student Facility System <onboarding@resend.dev>',
//     to,
//     subject,
//     text,
//     html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//       <h2 style="color: #4a5568;">Student Facility System</h2>
//       <p>${text}</p>
//       <p style="margin-top: 20px; font-size: 12px; color: #718096;">
//         This is an automated message. Please do not reply to this email.
//       </p>
//     </div>`,
//     attachments: resendAttachments,
//   });
//
//   if (error) {
//     console.error('Error sending email:', error);
//     throw new Error(error.message || 'Failed to send email');
//   }
//
//   console.log('Email sent successfully. Message ID:', data.id);
//   return { success: true, messageId: data.id };
// };

// ─── Previous implementation: nodemailer + Gmail SMTP ──────────────────────
// Kept for reference in case this backend is ever deployed somewhere that
// allows outbound SMTP (Render's free tier blocks it, which is why this was
// replaced with the SendGrid HTTP API above). To switch back: comment out
// the SendGrid code above, uncomment this block, and set EMAIL + APP_PASSWORD
// (a Gmail App Password, not your normal password) in the environment.
//
// const nodemailer = require('nodemailer');
//
// const createTransporter = () => {
//   if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
//     console.error('EMAIL or APP_PASSWORD environment variables are missing');
//     throw new Error('Email configuration is incomplete');
//   }
//
//   console.log('Creating email transporter with:', process.env.EMAIL);
//
//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL, // Gmail email address
//       pass: process.env.APP_PASSWORD, // Gmail app password
//     },
//     // Without these, a blocked/unreachable SMTP connection hangs the
//     // request indefinitely instead of failing with a clear error.
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//     debug: true,
//     logger: true
//   });
// };
//
// const sendEmailViaNodemailer = async (to, subject, text, attachments = []) => {
//   try {
//     console.log(`Sending email to ${to} with subject "${subject}"`);
//
//     const transporter = createTransporter();
//
//     const mailOptions = {
//       from: `"Student Facility System" <${process.env.EMAIL}>`,
//       to: to,
//       subject: subject,
//       text: text,
//       html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
//         <h2 style="color: #4a5568;">Student Facility System</h2>
//         <p>${text}</p>
//         <p style="margin-top: 20px; font-size: 12px; color: #718096;">
//           This is an automated message. Please do not reply to this email.
//         </p>
//       </div>`,
//       attachments,
//     };
//
//     const info = await transporter.sendMail(mailOptions);
//
//     console.log('Email sent successfully. Message ID:', info.messageId);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };
