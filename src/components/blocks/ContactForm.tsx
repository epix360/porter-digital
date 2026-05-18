import { ContactForm as ContactFormControl } from '@/components/contact-form/ContactForm';
import type { ContactFormBlock } from '@/lib/types';

export function ContactForm({ block }: { block: ContactFormBlock }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'ContactForm block: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set — not rendering form.',
      );
    }
    return null;
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-xl">
        {block.heading && (
          <h2 className="font-display text-3xl md:text-4xl">{block.heading}</h2>
        )}
        {block.intro && (
          <p className="mt-3 text-base text-neutral-600">{block.intro}</p>
        )}
        <div className="mt-8">
          <ContactFormControl
            turnstileSiteKey={siteKey}
            submitLabel={block.submitLabel}
            successMessage={block.successMessage}
          />
        </div>
      </div>
    </section>
  );
}
