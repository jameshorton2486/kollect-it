/**
 * Report Email Sender
 * Phase 5 - Send reports via email (SMTP)
 */

interface ReportEmailOptions {
  recipients: string[];
  reportName: string;
  data: string;
  format: "JSON" | "CSV" | "HTML";
}

/**
 * Generate HTML email template for reports
 * Reserved for SMTP email implementation
 * @internal
 */
// @ts-ignore - Reserved for future email implementation
function generateEmailTemplate(
  reportName: string,
  data: string,
  format: string,
): string {
  const timestamp = new Date().toLocaleString();

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Email template styles - using hex colors intentionally
     * CSS variables (var(--gold-500)) are NOT supported in email clients (Gmail, Outlook, Apple Mail, etc.)
     * Using hex colors ensures compatibility across all email clients
     */
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #F9FAFB; padding: 20px; border-radius: 0 0 8px 8px; }
    .metrics { background: white; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
    .data-preview { background: #F3F4F6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    /* Email template styles - using hex colors intentionally
     * CSS variables are not supported in email clients (Gmail, Outlook, etc.)
     */
    .button { display: inline-block; background: #D4AF37; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📊 ${reportName}</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Generated on ${timestamp}</p>
    </div>

    <div class="content">
      <p>Hello,</p>
      <p>Your scheduled analytics report is ready. Here's a preview of the data:</p>

      <div class="metrics">
        <h3>Report Summary</h3>
        <table>
          <tr>
            <td><strong>Report Name:</strong></td>
            <td>${reportName}</td>
          </tr>
          <tr>
            <td><strong>Format:</strong></td>
            <td>${format}</td>
          </tr>
          <tr>
            <td><strong>Generated At:</strong></td>
            <td>${timestamp}</td>
          </tr>
        </table>
      </div>

      <div class="metrics">
        <h3>Data Preview</h3>
        <div class="data-preview">${escapeHtml(data.substring(0, 500))}${data.length > 500 ? "..." : ""}</div>
      </div>

      <p>The complete report has been attached to this email.</p>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/analytics" class="button">View in Dashboard</a>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    </div>

    <div class="footer">
      <p>This is an automated report from Kollect-It Analytics.</p>
      <p>Do not reply to this email. Contact info@kollect-it.com for assistance.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Get filename for report attachment
 * Reserved for SMTP email implementation
 * @internal
 */
// @ts-ignore - Reserved for future email implementation
function getReportFilename(reportName: string, format: string): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .split("T")[0];
  const sanitized = reportName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
  const ext =
    format.toLowerCase() === "json"
      ? "json"
      : format.toLowerCase() === "csv"
        ? "csv"
        : "html";
  return `${sanitized}_${timestamp}.${ext}`;
}

/**
 * Send report via email
 * NOTE: Email service uses SMTP
 */
export async function sendReportEmail(
  options: ReportEmailOptions,
): Promise<{ sent: boolean; error?: string }> {
  const { recipients, reportName, data, format } = options;

  const { isEmailConfigured, sendRawEmail } = await import("@/lib/email");
  if (!isEmailConfigured()) {
    console.warn(
      "[Report Email] Email not configured - report delivery skipped",
    );
    return { sent: false, error: "Email not configured" };
  }

  const html = generateEmailTemplate(reportName, data, format);
  const subject = `Kollect-It Report: ${reportName}`;

  const results = await Promise.all(
    recipients.map((to) => sendRawEmail(to, subject, html)),
  );

  const failed = results.find((r) => !r.success);
  if (failed) {
    return { sent: false, error: failed.error || "Email delivery failed" };
  }

  return { sent: true };
}

/**
 * Send alert email
 * NOTE: Email service uses SMTP
 */
export async function sendAlertEmail(
  recipients: string[],
  subject: string,
  content: string,
): Promise<{ sent: boolean; error?: string }> {
  const { isEmailConfigured, sendRawEmail } = await import("@/lib/email");
  if (!isEmailConfigured()) {
    console.warn("[Alert Email] Email not configured - alert skipped");
    return { sent: false, error: "Email not configured" };
  }

  const html = generateEmailTemplate(subject, content, "HTML");
  const results = await Promise.all(
    recipients.map((to) => sendRawEmail(to, subject, html)),
  );

  const failed = results.find((r) => !r.success);
  if (failed) {
    return { sent: false, error: failed.error || "Alert delivery failed" };
  }

  return { sent: true };
}
