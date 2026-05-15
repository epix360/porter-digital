import { SanityImage } from '@/components/SanityImage';
import type { TestimonialBlock } from '@/lib/types';

export function Testimonial({ block }: { block: TestimonialBlock }) {
  return (
    <section className="container py-16 md:py-24">
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote className="font-display text-2xl leading-snug md:text-3xl">
          “{block.quote}”
        </blockquote>
        {(block.authorName || block.authorTitle || block.authorImage?.asset) && (
          <figcaption className="mt-8 flex flex-col items-center gap-3">
            {block.authorImage?.asset && (
              <SanityImage
                image={block.authorImage}
                alt={block.authorName || ''}
                width={56}
                height={56}
                sizes="56px"
                className="h-14 w-14 rounded-full object-cover"
              />
            )}
            <div className="text-sm">
              {block.authorName && <p className="font-medium">{block.authorName}</p>}
              {block.authorTitle && (
                <p className="text-text-muted">{block.authorTitle}</p>
              )}
            </div>
          </figcaption>
        )}
      </figure>
    </section>
  );
}
