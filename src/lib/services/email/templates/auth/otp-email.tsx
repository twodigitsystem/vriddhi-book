import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
    Link,
} from '@react-email/components';

interface OTPEmailProps {
    otp: string;
}

const OTPEmail = ({ otp }: OTPEmailProps) => {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>Your Verification Code</Preview>
                <Body className="bg-gray-100 font-sans py-10">
                    <Container className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-10">
                        {/* Header */}
                        <Section className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Text className="text-white text-2xl font-bold m-0">🔐</Text>
                            </div>
                            <Heading className="text-3xl font-bold text-gray-900 m-0 mb-2">
                                Verification Code
                            </Heading>
                            <Text className="text-base text-gray-600 m-0">
                                Use this code to verify your identity
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-8 text-center">
                            <Text className="text-lg text-gray-900 mb-4 font-medium">
                                Here is your one-time password (OTP):
                            </Text>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 inline-block">
                                <Text className="text-4xl font-mono font-bold text-gray-900 tracking-widest m-0">
                                    {otp}
                                </Text>
                            </div>

                            <Text className="text-base text-gray-700 leading-6 mb-6">
                                This code will expire in 15 minutes. Do not share this code with anyone.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-6" />

                        {/* Footer */}
                        <Section>
                            <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                                © 2025 Vriddhi Book. All rights reserved.
                            </Text>
                            <Text className="text-xs text-gray-500 text-center leading-5 m-0">
                                If you didn't request this code, you can safely ignore this email.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

OTPEmail.PreviewProps = {
    otp: "123456",
};

export default OTPEmail;
