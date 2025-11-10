/**
 * Email Service Placeholder
 * REMOVED: 11/10/2025 - Migrating to Google Workspace
 * TODO: Implement Google Workspace SMTP when ready
 */

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: Array<{ title: string; price: number; quantity: number }>;
  shippingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
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

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  console.log('[Email Disabled] Order confirmation for:', data.orderNumber);
  return { success: true };
}

export async function sendOrderStatusUpdateEmail(data: StatusUpdateEmailData) {
  console.log('[Email Disabled] Status update for:', data.orderNumber);
  return { success: true };
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  console.log('[Email Disabled] Welcome email for:', data.email);
  return { success: true };
}

export async function sendAdminNewOrderEmail(data: OrderEmailData) {
  console.log('[Email Disabled] Admin notification for:', data.orderNumber);
  return { success: true };
}
