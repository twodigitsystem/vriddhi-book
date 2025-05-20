//src\lib\email\templates\verification-email.tsx
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
import { render } from "@react-email/render";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerificationEmail({
  name,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Zoho Clone</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Welcome to Zoho Clone! Please verify your email address by clicking
            the button below:
          </Text>
          <Section style={buttonContainer}>
            <Button href={verificationUrl} style={button}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If the button above doesn&apos;t work, you can also click this link:{" "}
            <Link href={verificationUrl} style={link}>
              {verificationUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  textAlign: "center" as const,
  margin: "16px 0",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "0 auto",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const link = {
  color: "#7c3aed",
  textDecoration: "underline",
};

export function renderVerificationEmail(props: VerificationEmailProps) {
  return render(<VerificationEmail {...props} />);
}
