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

interface NewsletterWelcomeEmailProps {
  firstName: string | null;
  siteUrl: string;
}

export function NewsletterWelcomeEmail({
  firstName,
  siteUrl,
}: NewsletterWelcomeEmailProps) {
  const greeting = firstName ? `Hi ${firstName}` : "Hello";

  return (
    <Html>
      <Head />
      <Preview>Welcome to the Kollect-It Collector's List</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to the Collector's List</Heading>
          
          <Text style={text}>{greeting},</Text>
          
          <Text style={text}>
            Thank you for joining the Kollect-It Collector's List! You'll be the first 
            to know when new pieces arrive – from rare books and fine art to historic 
            militaria and unique collectibles.
          </Text>

          <Text style={text}>
            Every item on Kollect-It is carefully researched, photographed, and 
            authenticated before listing. We focus on quality over quantity, so you 
            can expect thoughtfully curated updates rather than constant emails.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${siteUrl}/browse`}>
              Browse Current Collection
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={textSmall}>
            <strong>What to expect:</strong>
          </Text>
          <Text style={textSmall}>
            • New arrival notifications (typically 1-2 times per month)
            <br />
            • Occasional insights on collecting and authentication
            <br />
            • Early access to special pieces
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You're receiving this because you subscribed at{" "}
            <Link href={siteUrl} style={link}>
              kollect-it.com
            </Link>
            .
            <br />
            Questions? Reply to this email or contact{" "}
            <Link href="mailto:james@kollect-it.com" style={link}>
              james@kollect-it.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default NewsletterWelcomeEmail;

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
  lineHeight: "1.6",
  margin: "8px 0",
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
  margin: "32px 0 24px",
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
