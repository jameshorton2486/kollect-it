/**
 * Report Email Sender
 * Phase 5 - Send reports via email (Google Workspace migration pending)
 */

interface ReportEmailOptions {
  recipients: string[];
  reportName: string;
  data: string;
  format: "JSON" | "CSV" | "HTML";
}

/**
 * Generate HTML email template for reports
 * Reserved for Google Workspace SMTP implementation
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
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: var(--surface-50); padding: 20px; border-radius: 0 0 8px 8px; }
    .metrics { background: white; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
    .data-preview { background: var(--surface-50); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    .button { display: inline-block; background: var(--gold-500); color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }
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
      <p>Do not reply to this email. Contact support@kollect-it.com for assistance.</p>
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
 * Reserved for Google Workspace SMTP implementation
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
 * NOTE: Email service disabled during Google Workspace migration
 */
export async function sendReportEmail(
  options: ReportEmailOptions,
): Promise<void> {
  const { recipients, reportName, format } = options;
  // data parameter available but unused until email service is implemented

  // Email service disabled during Google Workspace migration
  console.log(
    "[Report Email] Service disabled - Google Workspace migration pending",
  );
  console.log("[Report Email] Would send to:", recipients);
  console.log("[Report Email] Report:", reportName);
  console.log("[Report Email] Format:", format);

  // TODO: Implement Google Workspace SMTP when ready
  // TODO: Use generateEmailTemplate() and getReportFilename() helper functions
  return;
}

/**
 * Send alert email
 * NOTE: Email service disabled during Google Workspace migration
 */
export async function sendAlertEmail(
  recipients: string[],
  subject: string,
  content: string,
): Promise<void> {
  console.log(
    "[Alert Email] Service disabled - Google Workspace migration pending",
  );
  console.log("[Alert Email] Would send to:", recipients);
  console.log("[Alert Email] Subject:", subject);
  console.log("[Alert Email] Content:", content);

  // TODO: Implement Google Workspace SMTP when ready
  return;
}

