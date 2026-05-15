import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/PortableText';
import type { FaqBlock } from '@/lib/types';

export function Faq({ block }: { block: FaqBlock }) {
  const items = block.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="container max-w-3xl py-16 md:py-24">
      {block.heading && (
        <h2 className="mb-10 text-center font-display text-3xl md:text-4xl">
          {block.heading}
        </h2>
      )}
      <div className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <details
            key={item._key}
            className="group py-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-medium">
              <span>{item.question}</span>
              <span
                aria-hidden
                className="transition group-open:rotate-45 text-text-muted"
              >
                +
              </span>
            </summary>
            <div className="prose prose-neutral mt-4 max-w-none text-text-muted">
              <PortableText value={item.answer} components={portableTextComponents} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
