import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface PasswordChangedEmailProps {
  name: string;
  siteUrl: string;
}

export function PasswordChangedEmail({
  name,
  siteUrl,
}: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Kollect-It password has been changed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Changed Successfully</Heading>
          
          <Text style={text}>Hi {name},</Text>
          
          <Text style={text}>
            This is a confirmation that the password for your Kollect-It account 
            has been successfully changed.
          </Text>

          <Text style={text}>
            If you made this change, no further action is needed.
          </Text>

          <Text style={textWarning}>
            If you did not change your password, please contact us immediately at{" "}
            <Link href="mailto:james@kollect-it.com" style={link}>
              james@kollect-it.com
            </Link>{" "}
            to secure your account.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent by{" "}
            <Link href={siteUrl} style={link}>
              Kollect-It
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordChangedEmail;

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

const textWarning = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
  padding: "16px",
  backgroundColor: "#fff8e6",
  borderRadius: "6px",
  borderLeft: "4px solid #c9a961",
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
