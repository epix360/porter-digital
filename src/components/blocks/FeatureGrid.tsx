import type { FeatureGridBlock } from '@/lib/types';

export function FeatureGrid({ block }: { block: FeatureGridBlock }) {
  const features = block.features ?? [];
  if (features.length === 0) return null;

  return (
    <section className="container py-16 md:py-24">
      {(block.eyebrow || block.heading || block.subheading) && (
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {block.eyebrow && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-brand-700">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="font-display text-3xl md:text-4xl">{block.heading}</h2>
          )}
          {block.subheading && (
            <p className="mt-4 text-text-muted">{block.subheading}</p>
          )}
        </div>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <li key={feature._key} className="rounded-lg border border-border p-6">
            {feature.icon && (
              <div
                aria-hidden
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700"
              >
                {feature.icon}
              </div>
            )}
            <h3 className="font-display text-lg">{feature.title}</h3>
            {feature.body && (
              <p className="mt-2 text-sm text-text-muted">{feature.body}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
