import Link from 'next/link';
import { resolveLink } from '@/lib/seo';
import type { CtaBlock } from '@/lib/types';

export function Cta({ block }: { block: CtaBlock }) {
  return (
    <section className="container py-16">
      <div className="rounded-2xl bg-neutral-900 px-8 py-16 text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl">{block.heading}</h2>
        {block.body && (
          <p className="mx-auto mt-4 max-w-2xl text-neutral-300">{block.body}</p>
        )}
        {block.link && (
          <Link
            href={resolveLink(block.link)}
            target={block.link.newTab ? '_blank' : undefined}
            rel={block.link.newTab ? 'noopener noreferrer' : undefined}
            className="mt-8 inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
          >
            {block.link.label}
          </Link>
        )}
      </div>
    </section>
  );
}
