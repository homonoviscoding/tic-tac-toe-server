import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInvitationEmail = async (to, inviterName, gameId) => {
  console.log(`Sending invitation email to ${to} from ${inviterName} for game ${gameId}`);
  // Implement actual email sending logic here
}

export const sendPasswordResetEmail = async (to, resetToken) => {
  console.log(`Sending password reset email to ${to} with token ${resetToken}`);
  // Implement actual email sending logic here
};


