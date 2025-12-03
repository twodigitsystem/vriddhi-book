import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

const ResetPasswordEmail = ({ name, resetUrl }: ResetPasswordEmailProps) => {

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your Vriddhi Book password</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Text className="text-white text-2xl font-bold m-0">🔒</Text>
              </div>
              <Heading className="text-3xl font-bold text-gray-900 m-0 mb-2">
                Reset Your Password
              </Heading>
              <Text className="text-base text-gray-600 m-0">
                Secure your Vriddhi Book account
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-lg text-gray-900 mb-4 font-medium">
                Hi {name},
              </Text>
              <Text className="text-base text-gray-700 leading-6 mb-4">
                We received a request to reset the password for your Vriddhi Book account. If you made this request, 
                click the button below to create a new password.
              </Text>
              <Text className="text-base text-gray-700 leading-6 mb-6">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="text-center mb-8">
              <Button
                href={resetUrl}
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-base font-semibold no-underline box-border inline-block"
              >
                Reset My Password
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-8">
              <Text className="text-sm text-gray-600 leading-5 mb-3">
                If the button above doesn't work, copy and paste this link into your browser:
              </Text>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 break-all">
                <Link href={resetUrl} className="text-blue-600 text-sm underline">
                  {resetUrl}
                </Link>
              </div>
            </Section>

            {/* Important Information */}
            <Section className="mb-8">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <Heading className="text-base font-bold text-amber-900 mb-2">
                  Important Information
                </Heading>
                <Text className="text-sm text-amber-800 mb-2">
                  • This password reset link will expire in 1 hour for security reasons
                </Text>
                <Text className="text-sm text-amber-800 mb-2">
                  • You can only use this link once to reset your password
                </Text>
                <Text className="text-sm text-amber-800 mb-2">
                  • After resetting, you'll need to log in with your new password
                </Text>
                <Text className="text-sm text-amber-800">
                  • Make sure to choose a strong, unique password for better security
                </Text>
              </div>
            </Section>

            {/* Security Notice */}
            <Section className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <Heading className="text-base font-bold text-red-900 mb-2">
                  Didn't Request This Reset?
                </Heading>
                <Text className="text-sm text-red-800 mb-3">
                  If you didn't request a password reset, someone may be trying to access your account. 
                  Please contact our support team immediately and consider changing your password as a precaution.
                </Text>
                <Button
                  href="https://vriddhi-book.vercel.app/support"
                  className="bg-red-600 text-white px-5 py-2 rounded text-sm font-semibold no-underline box-border"
                >
                  Contact Support
                </Button>
              </div>
            </Section>

            {/* Password Tips */}
            <Section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <Heading className="text-base font-bold text-blue-900 mb-2">
                  Password Security Tips
                </Heading>
                <Text className="text-sm text-blue-800 mb-1">
                  • Use at least 8 characters with a mix of letters, numbers, and symbols
                </Text>
                <Text className="text-sm text-blue-800 mb-1">
                  • Avoid using personal information like names or birthdays
                </Text>
                <Text className="text-sm text-blue-800 mb-1">
                  • Don't reuse passwords from other accounts
                </Text>
                <Text className="text-sm text-blue-800">
                  • Consider using a password manager for better security
                </Text>
              </div>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Additional Help */}
            <Section className="mb-6">
              <Text className="text-sm text-gray-600 leading-5 mb-2">
                <strong>Need help?</strong>
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-1">
                • Make sure to check your spam/junk folder if you don't see this email
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-1">
                • The reset link must be opened in a web browser
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-1">
                • Clear your browser cache if you encounter any issues
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-4">
                • Contact support if the link doesn't work or has expired
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Footer */}
            <Section>
              <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                © 2025 Vriddhi Book. All rights reserved.
              </Text>
              <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                This email was sent because a password reset was requested for your account.
              </Text>
              <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                <Link href="https://vriddhi-book.vercel.app/privacy" className="text-gray-500 underline">
                  Privacy Policy
                </Link>
                {" • "}
                <Link href="https://vriddhi-book.vercel.app/support" className="text-gray-500 underline">
                  Support
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  name: "Alex Chen",
  resetUrl: "https://vriddhi-book.vercel.app/reset-password?token=abc123xyz789",
};

export default ResetPasswordEmail;