import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/PortableText';
import type { RichTextBlock } from '@/lib/types';

export function RichText({ block }: { block: RichTextBlock }) {
  if (!block.content) return null;
  return (
    <section className="container max-w-3xl py-12">
      <div className="prose prose-neutral max-w-none">
        <PortableText value={block.content} components={portableTextComponents} />
      </div>
    </section>
  );
}
