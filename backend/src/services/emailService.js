/**
 * Email Service
 * Business logic for sending emails (placeholder for future implementation)
 */

import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Send email (placeholder - implement with nodemailer or other service)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} options.text - Email text content
 */
const sendEmail = async ({ to, subject, html, text }) => {
  // TODO: Implement actual email sending with nodemailer
  // For now, just log the email
  logger.info(`Email would be sent to: ${to}`);
  logger.info(`Subject: ${subject}`);
  
  if (env.NODE_ENV === 'development') {
    console.log('=== Email Preview ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', text || html);
    console.log('====================');
  }

  return { success: true, message: 'Email logged (not sent in development)' };
};

/**
 * Send welcome email
 * @param {Object} user - User object
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Axon!';
  const html = `
    <h1>Welcome, ${user.first_name}!</h1>
    <p>Thank you for creating an account with Axon.</p>
    <p>Start exploring our beautiful furniture collection today.</p>
    <a href="${env.FRONTEND_URL}">Visit Our Store</a>
  `;
  const text = `Welcome, ${user.first_name}! Thank you for creating an account with Axon.`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send order confirmation email
 * @param {Object} order - Order object
 * @param {Object} user - User object
 */
const sendOrderConfirmationEmail = async (order, user) => {
  const subject = `Order Confirmation - ${order.order_number}`;
  const html = `
    <h1>Order Confirmed!</h1>
    <p>Hi ${user.first_name},</p>
    <p>Your order <strong>${order.order_number}</strong> has been confirmed.</p>
    <p><strong>Total:</strong> ${order.total_amount} ETB</p>
    <p>We'll send you another email when your order ships.</p>
    <a href="${env.FRONTEND_URL}/orders/${order.id}">View Order</a>
  `;
  const text = `Order ${order.order_number} confirmed. Total: ${order.total_amount} ETB`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send order shipped email
 * @param {Object} order - Order object
 * @param {Object} user - User object
 */
const sendOrderShippedEmail = async (order, user) => {
  const subject = `Your Order is on its way! - ${order.order_number}`;
  const html = `
    <h1>Your Order Has Shipped!</h1>
    <p>Hi ${user.first_name},</p>
    <p>Great news! Your order <strong>${order.order_number}</strong> is on its way.</p>
    <a href="${env.FRONTEND_URL}/orders/${order.id}">Track Order</a>
  `;
  const text = `Your order ${order.order_number} has shipped!`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset</h1>
    <p>Hi ${user.first_name},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  const text = `Reset your password: ${resetUrl}`;

  return sendEmail({ to: user.email, subject, html, text });
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendPasswordResetEmail,
};
