import { SanityImage } from '@/components/SanityImage';
import type { LogoCloudBlock } from '@/lib/types';

export function LogoCloud({ block }: { block: LogoCloudBlock }) {
  const logos = block.logos ?? [];
  if (logos.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-muted py-12">
      <div className="container">
        {block.heading && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-text-muted">
            {block.heading}
          </p>
        )}
        <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
          {logos.map((logo) => {
            const inner = (
              <SanityImage
                image={logo.image}
                alt={logo.name}
                width={160}
                height={48}
                sizes="160px"
                className="mx-auto h-10 w-auto object-contain opacity-70 transition hover:opacity-100"
              />
            );
            return (
              <li key={logo._key} className="flex items-center justify-center">
                {logo.url ? (
                  <a href={logo.url} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
