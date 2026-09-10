// utils/emailService.js
require('dotenv').config();

const MAILJET_EMAIL_URL = 'https://api.mailjet.com/v3.1/send';

const ensureConfigured = () => {
  if (!process.env.MAILJET_API_KEY) {
    console.error('MAILJET_API_KEY environment variable is missing');
    throw new Error('Email configuration is incomplete');
  }
  if (!process.env.MAILJET_SECRET_KEY) {
    console.error('MAILJET_SECRET_KEY environment variable is missing');
    throw new Error('Email configuration is incomplete');
  }
  if (!process.env.MAILJET_FROM) {
    console.error('MAILJET_FROM environment variable is missing');
    throw new Error('Email configuration is incomplete');
  }
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const attachmentContent = (content) => {
  if (Buffer.isBuffer(content)) return content.toString('base64');
  if (typeof content === 'string') return content;
  throw new Error('Email attachments must contain a Buffer or base64 string');
};

// Sends all transactional emails through Mailjet's HTTPS API. Attachments use
// the same { filename, content } shape expected by the existing callers.
const sendEmail = async (to, subject, text, attachments = []) => {
  ensureConfigured();
  console.log(`Sending email to ${to} with subject "${subject}"`);

  const message = {
    From: {
      Email: process.env.MAILJET_FROM,
      Name: 'Student Facility System',
    },
    To: [{ Email: to }],
    Subject: subject,
    TextPart: text,
    HTMLPart: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4a5568;">Student Facility System</h2>
      <p>${escapeHtml(text).replace(/\r?\n/g, '<br>')}</p>
      <p style="margin-top: 20px; font-size: 12px; color: #718096;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>`,
  };

  if (attachments.length > 0) {
    message.Attachments = attachments.map((attachment) => ({
      Filename: attachment.filename,
      ContentType: attachment.contentType || attachment.type || 'application/octet-stream',
      Base64Content: attachmentContent(attachment.content),
    }));
  }

  try {
    const credentials = Buffer.from(
      `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`
    ).toString('base64');

    const response = await fetch(MAILJET_EMAIL_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Basic ${credentials}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ Messages: [message] }),
      signal: AbortSignal.timeout(15000),
    });

    const responseBody = await response.json().catch(() => ({}));
    const result = responseBody.Messages?.[0];
    if (!response.ok || result?.Status === 'error') {
      const apiErrors = result?.Errors?.map((item) => item.ErrorMessage).filter(Boolean);
      throw new Error(
        apiErrors?.join('; ') ||
        responseBody.ErrorMessage ||
        `Mailjet email request failed (${response.status})`
      );
    }

    const recipientResult = result?.To?.[0];
    const messageId = recipientResult?.MessageID || recipientResult?.MessageUUID;
    console.log('Email sent successfully. Message ID:', messageId);
    return { success: true, messageId };
  } catch (error) {
    const message = error.name === 'TimeoutError'
      ? 'Mailjet email request timed out'
      : error.message;
    console.error('Error sending email:', message);
    throw new Error(message || 'Failed to send email');
  }
};

module.exports = sendEmail;
