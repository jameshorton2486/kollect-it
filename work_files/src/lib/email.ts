/**
 * Email Service with Google Workspace SMTP
 *
 * Features:
 * - Nodemailer with connection pooling
 * - React Email template rendering
 * - Automatic retry with exponential backoff
 * - Error logging and monitoring
 *
 * Setup Instructions:
 * 1. Create Google Workspace account ($6/month)
 * 2. Enable 2FA on your account
 * 3. Generate App Password: https://myaccount.google.com/apppasswords
 * 4. Add to .env.local:
 *    EMAIL_FROM="Kollect-It <noreply@yourdomain.com>"
 *    EMAIL_HOST="smtp.gmail.com"
 *    EMAIL_PORT="587"
 *    EMAIL_USER="noreply@yourdomain.com"
 *    EMAIL_PASSWORD="your-app-password"
 */

import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";
import { OrderStatusUpdateEmail } from "@/emails/OrderStatusUpdateEmail";
import { AdminNewOrderEmail } from "@/emails/AdminNewOrderEmail";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { PasswordChangedEmail } from "@/emails/PasswordChangedEmail";
import { ContactNotificationEmail } from "@/emails/ContactNotificationEmail";
import { NewsletterWelcomeEmail } from "@/emails/NewsletterWelcomeEmail";

// Email data interfaces
interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: Array<{ title: string; price: number; quantity: number }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface StatusUpdateEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
}

interface WelcomeEmailData {
  name: string;
  email: string;
}

interface PasswordResetEmailData {
  email: string;
  name: string;
  resetUrl: string;
}

interface PasswordChangedEmailData {
  name: string;
  email: string;
}

interface ContactNotificationEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionId: string;
}

interface NewsletterWelcomeEmailData {
  email: string;
  firstName: string | null;
}

// Email configuration
const EMAIL_ENABLED = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

// Create reusable transporter with connection pooling
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!EMAIL_ENABLED) {
    console.warn("[Email] Email not configured - emails will be logged only");
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
    });

    // Verify connection on startup
    transporter.verify((error) => {
      if (error) {
        console.error("[Email] SMTP connection failed:", error);
      } else {
        console.log("[Email] SMTP connection established");
      }
    });
  }

  return transporter;
}

// Generic email sender with retry logic
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  retries = 3,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transport = getTransporter();

  if (!transport) {
    console.log(`[Email Disabled] To: ${to}, Subject: ${subject}`);
    return { success: true, messageId: "disabled" };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transport.sendMail({
        from: process.env.EMAIL_FROM || '"Kollect-It" <noreply@kollect-it.com>',
        to,
        subject,
        html,
      });

      console.log(`[Email Sent] To: ${to}, MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[Email Error] Attempt ${attempt}/${retries}:`, error);

      if (attempt === retries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      // Exponential backoff: 1s, 2s, 4s
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)),
      );
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

// Get site URL based on environment
function getSiteUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const html = await render(
    OrderConfirmationEmail({
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      total: data.total,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      items: data.items,
      shippingAddress: data.shippingAddress,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(
    data.customerEmail,
    `Order Confirmation - ${data.orderNumber}`,
    html,
  );
}

/**
 * Send order status update email to customer
 */
export async function sendOrderStatusUpdateEmail(data: StatusUpdateEmailData) {
  const html = await render(
    OrderStatusUpdateEmail({
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      status: data.status,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      siteUrl: getSiteUrl(),
    }),
  );

  const statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1);
  return sendEmail(
    data.customerEmail,
    `Order ${statusText} - ${data.orderNumber}`,
    html,
  );
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const html = await render(
    WelcomeEmail({
      name: data.name,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(data.email, "Welcome to Kollect-It!", html);
}

/**
 * Send new order notification to admin
 */
export async function sendAdminNewOrderEmail(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!adminEmail) {
    console.warn(
      "[Email] No admin email configured - skipping admin notification",
    );
    return { success: false, error: "No admin email configured" };
  }

  const html = await render(
    AdminNewOrderEmail({
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      total: data.total,
      items: data.items,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(
    adminEmail,
    `New Order Received - ${data.orderNumber}`,
    html,
  );
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const html = await render(
    PasswordResetEmail({
      name: data.name,
      resetUrl: data.resetUrl,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(
    data.email,
    "Reset Your Kollect-It Password",
    html,
  );
}

/**
 * Send password changed confirmation email
 */
export async function sendPasswordChangedEmail(
  data: PasswordChangedEmailData,
) {
  const html = await render(
    PasswordChangedEmail({
      name: data.name,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(
    data.email,
    "Your Kollect-It Password Was Changed",
    html,
  );
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotificationEmail(
  data: ContactNotificationEmailData,
) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!adminEmail) {
    console.warn(
      "[Email] No admin email configured - skipping contact notification",
    );
    return { success: false, error: "No admin email configured" };
  }

  const html = await render(
    ContactNotificationEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      submissionId: data.submissionId,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(
    adminEmail,
    `New Contact Form Submission: ${data.subject}`,
    html,
  );
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcomeEmail(
  data: NewsletterWelcomeEmailData,
) {
  const html = await render(
    NewsletterWelcomeEmail({
      firstName: data.firstName,
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(
    data.email,
    "Welcome to the Kollect-It Collector's List",
    html,
  );
}

/**
 * Test email configuration
 */
export async function sendTestEmail(to: string) {
  const html = await render(
    WelcomeEmail({
      name: "Test User",
      siteUrl: getSiteUrl(),
    }),
  );

  return sendEmail(to, "Test Email from Kollect-It", html);
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return EMAIL_ENABLED;
}

/**
 * Get email configuration status (safe for client display)
 */
export function getEmailStatus() {
  return {
    enabled: EMAIL_ENABLED,
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    user: process.env.EMAIL_USER
      ? `${process.env.EMAIL_USER.substring(0, 3)}***`
      : "Not configured",
    from: process.env.EMAIL_FROM || "Not configured",
  };
}

