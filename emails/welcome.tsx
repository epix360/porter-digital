import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type WelcomeEmailProps = {
  name?: string;
  ctaUrl?: string;
};

export default function WelcomeEmail({
  name = 'there',
  ctaUrl = 'https://example.com',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome aboard</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#fafafa' }}>
        <Container style={{ padding: '24px', maxWidth: '560px' }}>
          <Heading style={{ fontSize: '24px', marginBottom: '16px' }}>
            Hey {name},
          </Heading>
          <Text style={{ fontSize: '16px', lineHeight: '1.5', color: '#404040' }}>
            Thanks for signing up. Click below to get started.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              href={ctaUrl}
              style={{
                backgroundColor: '#0ea5e9',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Get Started
            </Button>
          </Section>
          <Text style={{ fontSize: '14px', color: '#737373' }}>
            If you didn't sign up, you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
