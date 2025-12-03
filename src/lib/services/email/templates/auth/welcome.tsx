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
  name: string;
}

const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  const previewText = `Welcome to Vriddhi Book, ${name}! Start managing your inventory & accounting today.`;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-gray-100 font-sans py-12">
          <Container className="bg-white rounded-2xl max-w-2xl mx-auto overflow-hidden">
            {/* Header with Better Visibility */}
            <Section className="bg-white text-center py-12 px-10 border-b-4 border-blue-600">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Text className="text-white text-3xl font-bold m-0">📊</Text>
              </div>
              <Heading className="text-4xl font-bold text-gray-900 m-0 mb-3">
                Welcome to Vriddhi Book!
              </Heading>
              <Text className="text-xl text-blue-600 m-0 font-semibold">
                Your Complete Business Management Solution
              </Text>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </Section>

            {/* Main Content */}
            <Section className="px-10 py-8">
              <Text className="text-2xl text-gray-900 mb-6 font-bold text-center">
                Hello {name}! 👋
              </Text>
              <Text className="text-lg text-gray-700 leading-7 mb-6 text-center">
                Congratulations on joining thousands of businesses who trust Vriddhi Book for their 
                <strong className="text-blue-600"> inventory management</strong>, 
                <strong className="text-green-600"> invoicing</strong>, and 
                <strong className="text-purple-600"> accounting</strong> needs.
              </Text>
              <Text className="text-base text-gray-600 leading-6 mb-8 text-center">
                Your account is now active and ready to transform how you manage your business operations.
              </Text>
            </Section>

            {/* Feature Cards */}
            <Section className="px-10 mb-8">
              <Heading className="text-xl font-bold text-gray-900 mb-6 text-center">
                What You Can Do with Vriddhi Book
              </Heading>
              
              <Row className="mb-4">
                <Column className="w-full">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 shrink-0">
                        <Text className="text-white text-xl font-bold m-0">📦</Text>
                      </div>
                      <div>
                        <Heading className="text-lg font-bold text-blue-900 mb-2 m-0">
                          Smart Inventory Management
                        </Heading>
                        <Text className="text-sm text-blue-800 m-0 leading-5">
                          Track stock levels, manage suppliers, set reorder points, and never run out of inventory again.
                        </Text>
                      </div>
                    </div>
                  </div>
                </Column>
              </Row>

              <Row className="mb-4">
                <Column className="w-full">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 shrink-0">
                        <Text className="text-white text-xl font-bold m-0">📄</Text>
                      </div>
                      <div>
                        <Heading className="text-lg font-bold text-green-900 mb-2 m-0">
                          Professional Invoicing
                        </Heading>
                        <Text className="text-sm text-green-800 m-0 leading-5">
                          Create beautiful invoices, track payments, send reminders, and get paid faster.
                        </Text>
                      </div>
                    </div>
                  </div>
                </Column>
              </Row>

              <Row className="mb-6">
                <Column className="w-full">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4 shrink-0">
                        <Text className="text-white text-xl font-bold m-0">📈</Text>
                      </div>
                      <div>
                        <Heading className="text-lg font-bold text-purple-900 mb-2 m-0">
                          Complete Accounting
                        </Heading>
                        <Text className="text-sm text-purple-800 m-0 leading-5">
                          Generate financial reports, track expenses, manage taxes, and monitor your business health.
                        </Text>
                      </div>
                    </div>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Quick Start Guide */}
            <Section className="px-10 mb-8">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <Heading className="text-lg font-bold text-amber-900 mb-4 text-center">
                  🚀 Quick Start Guide
                </Heading>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mr-3 shrink-0">
                      <Text className="text-sm font-bold m-0">1</Text>
                    </div>
                    <Text className="text-sm text-amber-800 m-0">
                      <strong>Set up your business profile</strong> and customize your invoice templates
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mr-3 shrink-0">
                      <Text className="text-sm font-bold m-0">2</Text>
                    </div>
                    <Text className="text-sm text-amber-800 m-0">
                      <strong>Add your first products</strong> to the inventory with pricing and stock levels
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mr-3 shrink-0">
                      <Text className="text-sm font-bold m-0">3</Text>
                    </div>
                    <Text className="text-sm text-amber-800 m-0">
                      <strong>Create your first invoice</strong> and experience the seamless workflow
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            {/* CTA Buttons */}
            <Section className="text-center px-10 mb-8">
              <Button
                href="https://vriddhi-book.vercel.app/dashboard"
                className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold no-underline box-border inline-block mb-4"
              >
                🚀 Launch Your Dashboard
              </Button>
              <br />
              <Link 
                href="https://vriddhi-book.vercel.app/getting-started"
                className="text-blue-600 text-base font-semibold underline"
              >
                📚 View Getting Started Guide
              </Link>
            </Section>

            {/* Support Section */}
            <Section className="px-10 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Heading className="text-lg font-bold text-gray-900 mb-3">
                  Need Help Getting Started?
                </Heading>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                  Our support team is here to help you succeed. We offer free onboarding assistance, 
                  video tutorials, and 24/7 customer support.
                </Text>
                <Row>
                  <Column className="text-center">
                    <Link 
                      href="https://vriddhi-book.vercel.app/support"
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg text-sm font-semibold no-underline box-border inline-block mr-2"
                    >
                      💬 Contact Support
                    </Link>
                  </Column>
                  <Column className="text-center">
                    <Link 
                      href="https://vriddhi-book.vercel.app/tutorials"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold no-underline box-border inline-block ml-2"
                    >
                      🎥 Watch Tutorials
                    </Link>
                  </Column>
                </Row>
              </div>
            </Section>

            <Hr className="border-gray-200 mx-10" />

            {/* Footer */}
            <Section className="px-10 py-6">
              <Text className="text-xs text-gray-500 text-center leading-5 mb-2">
                © 2025 Vriddhi Book. All rights reserved.
              </Text>
              <Text className="text-xs text-gray-500 text-center leading-5 mb-2">
                You're receiving this email because you recently created an account with us.
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
                <Link href="https://vriddhi-book.vercel.app/unsubscribe" className="text-gray-500 underline">
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
  name: "Alex Chen",
};

export default WelcomeEmail;