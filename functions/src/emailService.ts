// functions/src/emailService.ts
import * as sgMail from '@sendgrid/mail';

// Set your SendGrid API key
sgMail.setApiKey('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');

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const msg = {
      to,
      from: 'v.fakunle@alustudent.com', // Verified sender email in SendGrid
      subject,
      html,
    };
    
    const response = await sgMail.send(msg);
    console.log('Email sent:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};