import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailLayoutProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
}

export const EmailLayout = ({
  preview,
  heading,
  children,
}: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Img
          src="https://your-logo-url.com/logo.png"
          width={150}
          height={40}
          alt="Logo"
        />
        <Heading style={styles.heading}>{heading}</Heading>
        <Section>{children}</Section>
        <Hr style={styles.hr} />
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
  },
  heading: {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
  },
  hr: {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  },
  footer: {
    color: "#8898aa",
    fontSize: "12px",
  },
};
