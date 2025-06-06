//src\lib\email\templates\profile-updated-email.tsx

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

interface ProfileUpdatedEmailProps {
  name: string;
  email: string;
  updatedFields: string[];
}

export function ProfileUpdatedEmail({
  name,
  updatedFields,
}: ProfileUpdatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Zoho Clone profile has been updated</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Profile Updated</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your Zoho Clone profile has been updated. The following information
            was changed:
          </Text>
          <Section style={listContainer}>
            <ul style={list}>
              {updatedFields.map((field) => (
                <li key={field} style={listItem}>
                  {field}
                </li>
              ))}
            </ul>
          </Section>
          <Text style={text}>
            If you didn&apos;t make these changes, please contact support
            immediately.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            You&apos;re receiving this email because you have an account with
            Zoho Clone. If you have any questions, you can reply to this email.
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

const listContainer = {
  margin: "24px 0",
};

const list = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 32px",
  margin: "16px 0",
};

const listItem = {
  margin: "8px 0",
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

export function renderProfileUpdatedEmail(props: ProfileUpdatedEmailProps) {
  return render(<ProfileUpdatedEmail {...props} />);
}
