import {
  Body,
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

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionId: string;
  siteUrl: string;
}

export function ContactNotificationEmail({
  name,
  email,
  subject,
  message,
  submissionId,
  siteUrl,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>

          <Section style={detailsBox}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>

            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Text style={label}>Message:</Text>
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Submission ID: {submissionId}
            <br />
            Reply directly to this email to respond to {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactNotificationEmail;

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
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const detailsBox = {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  padding: "16px 20px",
  marginBottom: "24px",
};

const label = {
  color: "#6a6a6a",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 16px",
};

const messageBox = {
  backgroundColor: "#fafafa",
  border: "1px solid #e6e6e6",
  borderRadius: "6px",
  padding: "20px",
  marginTop: "8px",
};

const messageText = {
  color: "#4a4a4a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "32px 0 16px",
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
