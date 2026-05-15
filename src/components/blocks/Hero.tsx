import Link from 'next/link';
import { SanityImage } from '@/components/SanityImage';
import { resolveLink } from '@/lib/seo';
import type { HeroBlock } from '@/lib/types';

export function Hero({ block }: { block: HeroBlock }) {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          {block.eyebrow && (
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent-700">
              {block.eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl text-brand-600 md:text-5xl">{block.heading}</h1>
          {block.subheading && (
            <p className="mt-6 text-lg text-text-muted">{block.subheading}</p>
          )}
          {block.ctas && block.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {block.ctas.map((cta, i) => (
                <Link
                  key={i}
                  href={resolveLink(cta)}
                  target={cta.newTab ? '_blank' : undefined}
                  rel={cta.newTab ? 'noopener noreferrer' : undefined}
                  className={
                    i === 0
                      ? 'inline-flex items-center rounded-md bg-accent-600 px-5 py-2.5 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-700'
                      : 'inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-muted'
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {block.image?.asset && (
          <div className="overflow-hidden rounded-xl">
            <SanityImage
              image={block.image}
              alt={block.image.alt || ''}
              width={1200}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="h-auto w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
