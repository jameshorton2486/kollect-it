import nodemailer from "nodemailer";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

async function testEmail() {
  console.log("🔧 Checking environment variables...");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

  console.log("\n🔧 Creating email transporter...");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.zoho.com",
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER || "info@kollect-it.com",
      pass: process.env.EMAIL_PASSWORD || "kkCfdWsF7wbK",
    },
  });

  console.log("📧 Sending test email...");

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Kollect-It <info@kollect-it.com>",
      to: "info@kollect-it.com",
      subject: "Test Email from Kollect-It",
      text: "This is a test email to verify Zoho SMTP configuration.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Configuration Test</h2>
          <p>This is a test email from Kollect-It to verify the Zoho SMTP configuration.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            This email was sent from the Kollect-It production environment.
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📤 Response:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    process.exit(1);
  }
}

testEmail();
