import { siteSettings } from './documents/siteSettings';
import { page } from './documents/page';
import { post } from './documents/post';
import { author } from './documents/author';
import { category } from './documents/category';
import { seo } from './objects/seo';
import { link } from './objects/link';
import { blockContent } from './objects/blockContent';
import { hero } from './objects/blocks/hero';
import { richText } from './objects/blocks/richText';
import { cta } from './objects/blocks/cta';
import { featureGrid } from './objects/blocks/featureGrid';
import { logoCloud } from './objects/blocks/logoCloud';
import { testimonial } from './objects/blocks/testimonial';
import { faq } from './objects/blocks/faq';

export const schemaTypes = [
  // Documents
  siteSettings,
  page,
  post,
  author,
  category,
  // Objects
  seo,
  link,
  blockContent,
  // Blocks (used inside pages.sections)
  hero,
  richText,
  cta,
  featureGrid,
  logoCloud,
  testimonial,
  faq,
];
