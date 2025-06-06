import { Button, Text } from "@react-email/components";
import { EmailLayout } from "../shared/layout";

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export const WelcomeEmail = ({ name, verificationUrl }: WelcomeEmailProps) => (
  <EmailLayout preview="Welcome to our platform!" heading={`Welcome, ${name}!`}>
    <Text>Thanks for signing up. We're excited to have you on board!</Text>
    <Text>Please verify your email address by clicking the button below:</Text>
    <Button
      href={verificationUrl}
      style={{
        backgroundColor: "#2563eb",
        borderRadius: "6px",
        color: "#fff",
        padding: "12px 20px",
      }}
    >
      Verify Email Address
    </Button>
  </EmailLayout>
);
