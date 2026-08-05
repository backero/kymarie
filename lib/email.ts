import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";

const FROM_ADDRESS = "Kumarie <onboarding@resend.dev>";

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { productName: string; quantity: number; unitPrice: number }[];
}

function itemsTableHtml(items: OrderEmailData["items"]) {
  return items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;">${item.productName} × ${item.quantity}</td><td style="padding:8px 0;text-align:right;">${formatPrice(item.unitPrice * item.quantity)}</td></tr>`
    )
    .join("");
}

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const client = getClient();
  if (!client) {
    console.log(`[email] RESEND_API_KEY not set — skipping confirmation email for ${order.orderNumber}`);
    return { success: false, skipped: true };
  }

  try {
    await client.emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2>Thank you, ${order.customerName}!</h2>
          <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            ${itemsTableHtml(order.items)}
          </table>
          <p style="font-size:18px;font-weight:600;">Total: ${formatPrice(order.total)}</p>
          <p style="color:#666;font-size:13px;">We'll email you again once your order ships.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendOrderShippedEmail(order: OrderEmailData) {
  const client = getClient();
  if (!client) {
    console.log(`[email] RESEND_API_KEY not set — skipping shipped email for ${order.orderNumber}`);
    return { success: false, skipped: true };
  }

  try {
    await client.emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject: `Your order is on its way — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2>Good news, ${order.customerName}!</h2>
          <p>Your order <strong>${order.orderNumber}</strong> has shipped and is on its way to you.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            ${itemsTableHtml(order.items)}
          </table>
          <p style="font-size:18px;font-weight:600;">Total: ${formatPrice(order.total)}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send order shipped email:", error);
    return { success: false, error };
  }
}
