import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
  siteUrl: string;
}

export function PasswordResetEmail({
  name,
  resetUrl,
  siteUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Kollect-It password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>

          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            We received a request to reset the password for your Kollect-It
            account. Click the button below to create a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in 1 hour. If you didn't request a password
            reset, you can safely ignore this email – your password won't be
            changed.
          </Text>

          <Text style={textSmall}>
            If the button doesn't work, copy and paste this link into your
            browser:
          </Text>
          <Text style={linkText}>
            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent by{" "}
            <Link href={siteUrl} style={link}>
              Kollect-It
            </Link>
            . If you have questions, contact us at{" "}
            <Link href="mailto:james@kollect-it.com" style={link}>
              james@kollect-it.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail;

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 20px",
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const textSmall = {
  color: "#6a6a6a",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "16px 0 8px",
};

const linkText = {
  fontSize: "14px",
  margin: "0 0 16px",
  wordBreak: "break-all" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#c9a961",
  borderRadius: "6px",
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 32px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "32px 0",
};

const link = {
  color: "#c9a961",
  textDecoration: "underline",
};

const footer = {
  color: "#8a8a8a",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};
