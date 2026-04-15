import fs from 'fs';
import nodemailer from 'nodemailer';
import { MAILBOX_LOG_PATH } from './db.js';

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const appendLocalMailbox = ({ to, subject, text }) => {
  const entry = [
    `Time: ${new Date().toISOString()}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    text,
    '-'.repeat(48),
    '',
  ].join('\n');

  fs.appendFileSync(MAILBOX_LOG_PATH, entry);
};

const sendMail = async ({ to, subject, text }) => {
  const transporter = createTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
      });
      return { delivered: true, mode: 'smtp' };
    } catch (error) {
      console.error('[Qamarun Beauty mailer] SMTP send failed, falling back to local log.', error);
    }
  }

  appendLocalMailbox({ to, subject, text });
  console.log(`[Qamarun Beauty mail fallback] ${to}: ${subject}`);
  return { delivered: false, mode: 'local-log' };
};

export const sendOtpEmail = async ({ to, otpCode }) =>
  sendMail({
    to,
    subject: 'Qamarun Beauty password reset OTP',
    text: `Your Qamarun Beauty OTP is ${otpCode}. It will expire in 10 minutes.`,
  });

export const sendOrderStatusEmail = async ({ to, orderId, status, cancelReason }) => {
  const subject = `Qamarun Beauty order ${orderId} is now ${status}`;
  const reasonLine =
    status === 'Cancelled' && cancelReason
      ? `\nCancellation reason: ${cancelReason}`
      : '';

  return sendMail({
    to,
    subject,
    text: `Your Qamarun Beauty order ${orderId} status is ${status}.${reasonLine}\n\nThank you for shopping with us.`,
  });
};
