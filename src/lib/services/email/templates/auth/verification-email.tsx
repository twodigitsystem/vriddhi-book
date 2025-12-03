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

interface VerificationEmailProps {
  name: string;
  email: string;
  verificationUrl: string;
}

const VerificationEmail = (props: VerificationEmailProps) => {
  const { name, email, verificationUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome to Vriddhi Book! Please verify your email address</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Text className="text-white text-2xl font-bold m-0">✓</Text>
              </div>
              <Heading className="text-3xl font-bold text-gray-900 m-0 mb-2">
                Welcome to Vriddhi Book!
              </Heading>
              <Text className="text-base text-gray-600 m-0">
                Please verify your email to get started
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-lg text-gray-900 mb-4 font-medium">
                Hi {name},
              </Text>
              <Text className="text-base text-gray-700 leading-6 mb-4">
                Thank you for signing up for Vriddhi Book! We're excited to have you on board.
              </Text>
              <Text className="text-base text-gray-700 leading-6 mb-4">
                To complete your registration and start using your account, please verify your email address: 
                <strong> {email}</strong>
              </Text>
              <Text className="text-base text-gray-700 leading-6 mb-6">
                Click the button below to verify your email and activate your account.
              </Text>
            </Section>

            {/* Verification Button */}
            <Section className="text-center mb-8">
              <Button
                href={verificationUrl}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-base font-semibold no-underline box-border inline-block"
              >
                Verify My Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-8">
              <Text className="text-sm text-gray-600 leading-5 mb-3">
                If the button above doesn't work, copy and paste this link into your browser:
              </Text>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 break-all">
                <Link href={verificationUrl} className="text-blue-600 text-sm underline">
                  {verificationUrl}
                </Link>
              </div>
            </Section>

            {/* What's Next */}
            <Section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <Heading className="text-base font-bold text-blue-900 mb-2">
                  What happens after verification?
                </Heading>
                <Text className="text-sm text-blue-800 mb-2">
                  • Your account will be fully activated and ready to use
                </Text>
                <Text className="text-sm text-blue-800 mb-2">
                  • You'll gain access to all Vriddhi Book features
                </Text>
                <Text className="text-sm text-blue-800 mb-2">
                  • You can start managing your books and inventory
                </Text>
                <Text className="text-sm text-blue-800">
                  • You'll receive important updates and notifications
                </Text>
              </div>
            </Section>

            {/* Important Notice */}
            <Section className="mb-8">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <Heading className="text-base font-bold text-amber-900 mb-2">
                  Important Notice
                </Heading>
                <Text className="text-sm text-amber-800 mb-2">
                  • This verification link will expire in 24 hours
                </Text>
                <Text className="text-sm text-amber-800 mb-2">
                  • You won't be able to access your account until verification is complete
                </Text>
                <Text className="text-sm text-amber-800 mb-2">
                  • If the link expires, you can request a new verification email
                </Text>
                <Text className="text-sm text-amber-800">
                  • Make sure to verify from the same device you used to sign up
                </Text>
              </div>
            </Section>

            {/* Didn't Sign Up */}
            <Section className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <Heading className="text-base font-bold text-red-900 mb-2">
                  Didn't Sign Up?
                </Heading>
                <Text className="text-sm text-red-800 mb-3">
                  If you didn't create an account with Vriddhi Book, someone may have used your email address by mistake. 
                  You can safely ignore this email, and no account will be created.
                </Text>
                <Text className="text-sm text-red-800">
                  If you're concerned about this, please contact our support team.
                </Text>
              </div>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Getting Started */}
            <Section className="mb-6">
              <Text className="text-sm text-gray-600 leading-5 mb-2">
                <strong>Getting Started with Vriddhi Book:</strong>
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-1">
                • Complete your profile setup after verification
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-1">
                • Explore our comprehensive book management features
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-1">
                • Check out our help center for tutorials and guides
              </Text>
              <Text className="text-sm text-gray-600 leading-5 mb-4">
                • Contact support if you need any assistance
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Footer */}
            <Section>
              <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                © 2025 Vriddhi Book. All rights reserved.
              </Text>
              <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                This email was sent to {email} because you signed up for a Vriddhi Book account.
              </Text>
              <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                <Link href="https://vriddhi-book.vercel.app/privacy" className="text-gray-500 underline">
                  Privacy Policy
                </Link>
                {" • "}
                <Link href="https://vriddhi-book.vercel.app/terms" className="text-gray-500 underline">
                  Terms of Service
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

VerificationEmail.PreviewProps = {
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  verificationUrl: "https://vriddhi-book.vercel.app/verify-email?token=abc123xyz789",
};

export default VerificationEmail;