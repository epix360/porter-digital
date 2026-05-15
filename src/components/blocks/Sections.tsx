import type { Section } from '@/lib/types';
import { Hero } from './Hero';
import { RichText } from './RichText';
import { Cta } from './Cta';
import { FeatureGrid } from './FeatureGrid';
import { LogoCloud } from './LogoCloud';
import { Testimonial } from './Testimonial';
import { Faq } from './Faq';

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'hero':
            return <Hero key={section._key} block={section} />;
          case 'richText':
            return <RichText key={section._key} block={section} />;
          case 'cta':
            return <Cta key={section._key} block={section} />;
          case 'featureGrid':
            return <FeatureGrid key={section._key} block={section} />;
          case 'logoCloud':
            return <LogoCloud key={section._key} block={section} />;
          case 'testimonial':
            return <Testimonial key={section._key} block={section} />;
          case 'faq':
            return <Faq key={section._key} block={section} />;
          default: {
            if (process.env.NODE_ENV !== 'production') {
              // Guards against the "added schema, forgot to register renderer" mistake.
              console.warn(
                `Sections: no renderer for block _type "${(section as { _type: string })._type}"`,
              );
            }
            return null;
          }
        }
      })}
    </>
  );
}
