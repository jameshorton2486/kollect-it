/**
 * Report Email Sender
 * Phase 5 - Send reports via Resend email service
 */

interface ReportEmailOptions {
  recipients: string[];
  reportName: string;
  data: string;
  format: 'JSON' | 'CSV' | 'HTML';
}

/**
 * Generate HTML email template for reports
 */
function generateEmailTemplate(reportName: string, data: string, format: string): string {
  const timestamp = new Date().toLocaleString();

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .metrics { background: white; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
    .data-preview { background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }
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
        <div class="data-preview">${escapeHtml(data.substring(0, 500))}${data.length > 500 ? '...' : ''}</div>
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
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Get filename for report attachment
 */
function getReportFilename(reportName: string, format: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const sanitized = reportName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
  const ext = format.toLowerCase() === 'json' ? 'json' : format.toLowerCase() === 'csv' ? 'csv' : 'html';
  return `${sanitized}_${timestamp}.${ext}`;
}

/**
 * Send report via email using Resend
 */
export async function sendReportEmail(options: ReportEmailOptions): Promise<void> {
  const { recipients, reportName, data, format } = options;

  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping email send');
    return;
  }

  // Try to import Resend, but don't fail if not installed
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailHtml = generateEmailTemplate(reportName, data, format);
    const filename = getReportFilename(reportName, format);

    // Send email with attachment
    // Note: Resend SDK attachment handling varies - this is a template
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'reports@kollect-it.com',
      to: recipients,
      subject: `📊 ${reportName} - ${new Date().toLocaleDateString()}`,
      html: emailHtml,
      attachments: [
        {
          filename,
          content: Buffer.from(data),
        },
      ],
    });

    console.log(`Report email sent to: ${recipients.join(', ')}`);
  } catch (error) {
    // Resend not installed or error occurred
    console.log(`Report email skipped (Resend not configured): ${recipients.join(', ')}`);
  }
}

/**
 * Send alert email
 */
export async function sendAlertEmail(
  recipients: string[],
  subject: string,
  content: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured, skipping alert email');
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; }
    .header { background: #ffc107; color: white; padding: 15px; border-radius: 4px 4px 0 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">⚠️ ${subject}</h2>
    </div>
    <div class="alert">
      <p>${content}</p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'alerts@kollect-it.com',
      to: recipients,
      subject: `⚠️ ${subject}`,
      html,
    });

    console.log(`Alert email sent to: ${recipients.join(', ')}`);
  } catch (error) {
    console.log(`Alert email skipped: ${recipients.join(', ')}`);
  }
}
