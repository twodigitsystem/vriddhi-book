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
  Row,
  Column,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  organizationName: string;
  dashboardUrl: string;
  profileUrl: string;
  supportUrl: string;
  inviterName?: string;
  userRole?: string;
}

const WelcomeEmail = ({
  userName,
  organizationName,
  dashboardUrl,
  profileUrl,
  supportUrl,
  inviterName,
  userRole
}: WelcomeEmailProps) => {

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome to {organizationName}! Let's get you started.</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-lg max-w-[600px] mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Text className="text-white text-[24px] font-bold m-0">✓</Text>
              </div>
              <Heading className="text-[32px] font-bold text-gray-900 m-0 mb-2">
                Welcome to {organizationName}!
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                You're now part of the team
              </Text>
            </Section>

            {/* Personal Welcome */}
            <Section className="mb-8">
              <Text className="text-[18px] text-gray-900 mb-4 font-medium">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Congratulations! You've successfully joined <strong>{organizationName}</strong> as a team member.
                {inviterName && ` ${inviterName} has added you to the team, and `}we're excited to have you on board!
              </Text>
              <Text className="text-[16px] text-gray-700 leading-6 mb-4">
                Your account is now active and you have access to your organization's inventory management, invoicing, and accounting system.
                {userRole && ` You've been assigned the role of <strong>${userRole}</strong>.`}
              </Text>
            </Section>

            {/* Quick Actions */}
            <Section className="mb-8">
              <Heading className="text-[20px] font-bold text-gray-900 mb-4">
                Quick Actions
              </Heading>
              <Row className="mb-4">
                <Column>
                  <Button
                    href={dashboardUrl}
                    className="bg-blue-600 text-white px-6 py-3 rounded-[6px] text-[14px] font-semibold no-underline box-border w-full text-center block mb-2"
                  >
                    Access Dashboard
                  </Button>
                </Column>
                <Column className="pl-2">
                  <Button
                    href={profileUrl}
                    className="bg-gray-600 text-white px-6 py-3 rounded-[6px] text-[14px] font-semibold no-underline box-border w-full text-center block mb-2"
                  >
                    Complete Profile
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Getting Started Steps */}
            <Section className="mb-8">
              <Heading className="text-[20px] font-bold text-gray-900 mb-4">
                Getting Started
              </Heading>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-start mb-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <Text className="text-[14px] font-semibold text-gray-900 m-0 mb-1">
                      Complete Your Profile
                    </Text>
                    <Text className="text-[14px] text-gray-600 m-0">
                      Add your personal information and set up your account preferences.
                    </Text>
                  </div>
                </div>
                <div className="flex items-start mb-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <Text className="text-[14px] font-semibold text-gray-900 m-0 mb-1">
                      Explore the Dashboard
                    </Text>
                    <Text className="text-[14px] text-gray-600 m-0">
                      Familiarize yourself with the interface and the tools available based on your role.
                    </Text>
                  </div>
                </div>
                <div className="flex items-start mb-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <Text className="text-[14px] font-semibold text-gray-900 m-0 mb-1">
                      Connect with Your Team
                    </Text>
                    <Text className="text-[14px] text-gray-600 m-0">
                      Reach out to your colleagues and start collaborating on daily operations.
                    </Text>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold mr-3 mt-0.5">
                    4
                  </div>
                  <div>
                    <Text className="text-[14px] font-semibold text-gray-900 m-0 mb-1">
                      Learn Your Responsibilities
                    </Text>
                    <Text className="text-[14px] text-gray-600 m-0">
                      Review your role permissions and understand what tasks you can perform in the system.
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            {/* What You Can Access */}
            <Section className="mb-8">
              <Heading className="text-[20px] font-bold text-gray-900 mb-4">
                What You Can Access
              </Heading>
              <Text className="text-[14px] text-gray-700 leading-5 mb-3">
                As a team member of {organizationName}, you now have access to:
              </Text>
              <Row>
                <Column>
                  <Text className="text-[14px] text-gray-700 m-0 mb-2 font-semibold">📦 Inventory System</Text>
                  <Text className="text-[12px] text-gray-600 m-0 mb-3">View and manage product inventory based on your role permissions.</Text>

                  <Text className="text-[14px] text-gray-700 m-0 mb-2 font-semibold">📊 Reports & Analytics</Text>
                  <Text className="text-[12px] text-gray-600 m-0">Access business reports and analytics relevant to your department.</Text>
                </Column>
                <Column className="pl-4">
                  <Text className="text-[14px] text-gray-700 m-0 mb-2 font-semibold">🧾 Invoicing Tools</Text>
                  <Text className="text-[12px] text-gray-600 m-0 mb-3">Create and manage invoices according to your assigned permissions.</Text>

                  <Text className="text-[14px] text-gray-700 m-0 mb-2 font-semibold">👥 Team Collaboration</Text>
                  <Text className="text-[12px] text-gray-600 m-0">Collaborate with other team members and stay updated on business activities.</Text>
                </Column>
              </Row>
            </Section>

            {/* Support Section */}
            <Section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <Heading className="text-[16px] font-bold text-blue-900 mb-2">
                  Need Help?
                </Heading>
                <Text className="text-[14px] text-blue-800 mb-3">
                  If you have any questions about using the system or need assistance with your role, don't hesitate to reach out.
                </Text>
                <Button
                  href={supportUrl}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md text-[14px] font-semibold no-underline box-border"
                >
                  Get Help
                </Button>
              </div>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Footer */}
            <Section>
              <Text className="text-[12px] text-gray-500 text-center leading-[18px] m-0">
                © 2025 {organizationName}. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center leading-[18px] m-0">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 text-center leading-[18px] m-0">
                <Link href="#" className="text-gray-500 underline">
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

WelcomeEmail.PreviewProps = {
  userName: "Alex Chen",
  organizationName: "TechFlow Solutions",
  dashboardUrl: "https://vriddhi-book.vercel.app/dashboard",
  profileUrl: "https://vriddhi-book.vercel.app/profile",
  supportUrl: "https://vriddhi-book.vercel.app/support",
  inviterName: "Sarah Johnson",
  userRole: "Sales Associate",
};

export default WelcomeEmail;