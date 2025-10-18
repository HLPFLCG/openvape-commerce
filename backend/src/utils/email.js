import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: config.email.auth,
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to OpenVape Commerce';
  const html = `
    <h1>Welcome ${user.firstName || 'there'}!</h1>
    <p>Thank you for creating an account with OpenVape Commerce.</p>
    <p>We're excited to have you as part of our community.</p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <br>
    <p>Best regards,<br>The OpenVape Commerce Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
    text: `Welcome ${user.firstName || 'there'}! Thank you for creating an account with OpenVape Commerce.`,
  });
};

export const sendOrderConfirmationEmail = async (user, order) => {
  const subject = `Order Confirmation - #${order.orderNumber}`;
  const html = `
    <h1>Order Confirmation</h1>
    <p>Hi ${user.firstName || 'there'},</p>
    <p>Thank you for your order! We've received your order and will process it shortly.</p>
    <h2>Order Details</h2>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
    <p><strong>Total:</strong> $${order.total}</p>
    <p>You can track your order status in your account dashboard.</p>
    <br>
    <p>Best regards,<br>The OpenVape Commerce Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
    text: `Order Confirmation - #${order.orderNumber}. Thank you for your order!`,
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hi ${user.firstName || 'there'},</p>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>The OpenVape Commerce Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
    text: `Password Reset Request. Visit: ${resetUrl}`,
  });
};

export const sendShippingNotificationEmail = async (user, order) => {
  const subject = `Your Order Has Shipped - #${order.orderNumber}`;
  const html = `
    <h1>Your Order Has Shipped!</h1>
    <p>Hi ${user.firstName || 'there'},</p>
    <p>Great news! Your order has been shipped.</p>
    <h2>Shipping Details</h2>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'Not available yet'}</p>
    <p>You can track your shipment using the tracking number above.</p>
    <br>
    <p>Best regards,<br>The OpenVape Commerce Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
    text: `Your Order Has Shipped - #${order.orderNumber}. Tracking: ${order.trackingNumber || 'Not available yet'}`,
  });
};