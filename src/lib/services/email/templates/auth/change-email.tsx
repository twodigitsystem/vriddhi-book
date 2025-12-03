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

interface ChangeEmailTemplateProps {
    userName: string;
    newEmail: string;
    verificationUrl: string;
    organizationName?: string;
}

const ChangeEmailTemplate = ({
    userName,
    newEmail,
    verificationUrl,
    organizationName = ''
}: ChangeEmailTemplateProps) => {

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>Verify your new email address for Vriddhi Book</Preview>
                <Body className="bg-gray-100 font-sans py-10">
                    <Container className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-10">
                        {/* Header */}
                        <Section className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Text className="text-white text-2xl font-bold m-0">@</Text>
                            </div>
                            <Heading className="text-3xl font-bold text-gray-900 m-0 mb-2">
                                Verify Your New Email
                            </Heading>
                            <Text className="text-base text-gray-600 m-0">
                                Complete your email change request
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-8">
                            <Text className="text-lg text-gray-900 mb-4 font-medium">
                                Hi {userName},
                            </Text>
                            <Text className="text-base text-gray-700 leading-6 mb-4">
                                You recently requested to change your email address for your Vriddhi Book account
                                {organizationName && ` at <strong>${organizationName}</strong>`}.
                            </Text>
                            <Text className="text-base text-gray-700 leading-6 mb-6">
                                To complete this change, please verify your new email address: <strong>{newEmail}</strong>
                            </Text>
                        </Section>

                        {/* Verification Button */}
                        <Section className="text-center mb-8">
                            <Button
                                href={verificationUrl}
                                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-base font-semibold no-underline box-border inline-block"
                            >
                                Verify New Email Address
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
                                    • Your current email will remain active until verification is complete
                                </Text>
                                <Text className="text-sm text-amber-800 mb-2">
                                    • If you didn't request this change, please contact support immediately
                                </Text>
                                <Text className="text-sm text-amber-800">
                                    • Once verified, all future notifications will be sent to your new email
                                </Text>
                            </div>
                        </Section>

                        {/* Security Notice */}
                        <Section className="mb-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                <Heading className="text-base font-bold text-red-900 mb-2">
                                    Didn't Request This Change?
                                </Heading>
                                <Text className="text-sm text-red-800 mb-3">
                                    If you didn't request to change your email address, someone may be trying to access your account.
                                    Please secure your account immediately and contact our support team.
                                </Text>
                                <Button
                                    href="https://vriddhi-book.vercel.app/support"
                                    className="bg-red-600 text-white px-5 py-2 rounded text-sm font-semibold no-underline box-border"
                                >
                                    Contact Support
                                </Button>
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
                                • The verification must be completed from the same device/browser
                            </Text>
                            <Text className="text-sm text-gray-600 leading-5 mb-4">
                                • Contact support if you're having trouble with the verification process
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-6" />

                        {/* Footer */}
                        <Section>
                            <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                                © 2025 Vriddhi Book. All rights reserved.
                            </Text>
                            <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                                This email was sent to verify your email change request.
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

ChangeEmailTemplate.PreviewProps = {
    userName: "Alex Chen",
    newEmail: "alex.chen.new@company.com",
    verificationUrl: "https://vriddhi-book.vercel.app/verify-email-change?token=abc123xyz789",
    organizationName: "TechFlow Solutions",
};

export default ChangeEmailTemplate;