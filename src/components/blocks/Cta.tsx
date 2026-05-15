import Link from 'next/link';
import { resolveLink } from '@/lib/seo';
import type { CtaBlock } from '@/lib/types';

export function Cta({ block }: { block: CtaBlock }) {
  return (
    <section className="container py-16">
      <div className="rounded-2xl bg-brand-700 px-8 py-16 text-center text-text-inverse">
        <h2 className="font-display text-3xl md:text-4xl">{block.heading}</h2>
        {block.body && (
          <p className="mx-auto mt-4 max-w-2xl text-secondary-300">{block.body}</p>
        )}
        {block.link && (
          <Link
            href={resolveLink(block.link)}
            target={block.link.newTab ? '_blank' : undefined}
            rel={block.link.newTab ? 'noopener noreferrer' : undefined}
            className="mt-8 inline-flex items-center rounded-md bg-accent-600 px-6 py-3 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-700"
          >
            {block.link.label}
          </Link>
        )}
      </div>
    </section>
  );
}
