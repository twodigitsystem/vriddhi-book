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

interface OrganizationInviteEmailProps {
    inviterName: string;
    inviteeName: string;
    organizationName: string;
    inviteLink: string;
    unsubscribeLink?: string;
}

const OrganizationInviteEmail = ({
    inviterName,
    inviteeName,
    organizationName,
    inviteLink,
    unsubscribeLink
}: OrganizationInviteEmailProps) => {

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>You've been invited to join {organizationName}</Preview>
                <Body className="bg-gray-100 font-sans py-10">
                    <Container className="bg-white rounded-xl shadow-lg max-w-[600px] mx-auto p-10">
                        {/* Header */}
                        <Section className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Text className="text-white text-[24px] font-bold m-0">
                                    {organizationName.charAt(0).toUpperCase()}
                                </Text>
                            </div>
                            <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-2">
                                You're Invited!
                            </Heading>
                            <Text className="text-[16px] text-gray-600 m-0">
                                Join {organizationName} and start collaborating
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-8">
                            <Text className="text-[18px] text-gray-900 mb-4 font-medium">
                                Hi {inviteeName},
                            </Text>
                            <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                                <strong>{inviterName}</strong> has invited you to join <strong>{organizationName}</strong>.
                                You'll have access to collaborate with the team, share resources, and contribute to exciting projects.
                            </Text>
                            <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                                Accept this invitation to get started and become part of our growing community.
                            </Text>
                        </Section>

                        {/* Call to Action Button */}
                        <Section className="text-center mb-8">
                            <Button
                                href={inviteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Accept invitation to ${organizationName}`}
                                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[16px] font-semibold no-underline box-border hover:bg-blue-700 transition-colors"
                            >
                                Accept Invitation
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Section className="mb-8">
                            <Text className="text-[14px] text-gray-600 text-center mb-2">
                                Or copy and paste this link in your browser:
                            </Text>
                            <Text className="text-center">
                                <Link
                                    href={inviteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-[14px] underline break-all"
                                >
                                    {inviteLink}
                                </Link>
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-6" />

                        {/* Additional Info */}
                        <Section className="mb-6">
                            <Text className="text-[14px] text-gray-600 leading-5">
                                <strong>What happens next?</strong>
                            </Text>
                            <Text className="text-[14px] text-gray-600 leading-5 mb-2">
                                • Click the invitation link to create your account
                            </Text>
                            <Text className="text-[14px] text-gray-600 leading-5 mb-2">
                                • Complete your profile setup
                            </Text>
                            <Text className="text-[14px] text-gray-600 leading-5 mb-4">
                                • Start collaborating with your new team
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[18px]">
                                This invitation will expire in 7 days. If you have any questions, feel free to reach out to {inviterName}.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-6" />

                        {/* Footer */}
                        <Section>
                            <Text className="text-[12px] text-gray-500 text-center leading-[18px] m-0">
                                © {new Date().getFullYear()} {organizationName}. All rights reserved.
                            </Text>
                            <Text className="text-[12px] text-gray-500 text-center leading-[18px] m-0">
                                123 Business Street, Suite 100, City, State 12345
                            </Text>
                            <Text className="text-[12px] text-gray-500 text-center leading-[18px] m-0">
                                <Link href={unsubscribeLink ?? '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline">
                                    Unsubscribe
                                </Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

OrganizationInviteEmail.PreviewProps = {
    inviterName: "Sarah Johnson",
    inviteeName: "Alex Chen",
    organizationName: "TechFlow Solutions",
    inviteLink: "https://app.techflow.com/invite/accept?token=abc123xyz789",
};

export default OrganizationInviteEmail;