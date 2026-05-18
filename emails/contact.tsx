import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

export default function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#fafafa' }}>
        <Container style={{ padding: '24px', maxWidth: '560px' }}>
          <Heading style={{ fontSize: '20px', marginBottom: '16px' }}>
            New contact form submission
          </Heading>
          <Section>
            <Text style={{ margin: '4px 0', fontSize: '14px', color: '#404040' }}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={{ margin: '4px 0', fontSize: '14px', color: '#404040' }}>
              <strong>Email:</strong> {email}
            </Text>
          </Section>
          <Hr style={{ borderColor: '#e5e5e5', margin: '16px 0' }} />
          <Section>
            <Text style={{ fontSize: '14px', color: '#404040', whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
