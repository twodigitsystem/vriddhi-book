import { Button, Text } from "@react-email/components";
import { EmailLayout } from "../shared/layout";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export const ResetPasswordEmail = ({
  name,
  resetUrl,
}: ResetPasswordEmailProps) => (
  <EmailLayout preview="Reset your password" heading="Reset Your Password">
    <Text>Hi {name},</Text>
    <Text>
      We received a request to reset your password. Click the button below to
      choose a new one:
    </Text>
    <Button
      href={resetUrl}
      style={{
        backgroundColor: "#2563eb",
        borderRadius: "6px",
        color: "#fff",
        padding: "12px 20px",
      }}
    >
      Reset Password
    </Button>
    <Text style={{ color: "#666666", fontSize: "14px" }}>
      If you didn't request this, you can safely ignore this email.
    </Text>
  </EmailLayout>
);
