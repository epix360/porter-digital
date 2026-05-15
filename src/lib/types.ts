/**
 * Hand-written types for the schemas this template ships with. These are
 * the source of truth until a downstream project diverges its schema —
 * at that point run `pnpm sanity:types` to generate `src/sanity/types.ts`
 * from the live schema and migrate imports to that file.
 *
 * The template can't ship a generated types file because `sanity schema
 * extract` requires a real project ID, which only exists after
 * `pnpm new-project`.
 */

import type { PortableTextBlock } from '@portabletext/types';

export type SanityImage = {
  alt?: string;
  asset: {
    _ref?: string;
    _id?: string;
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio: number };
      lqip?: string;
    };
  };
};

export type Link = {
  label: string;
  linkType: 'internal' | 'external';
  newTab?: boolean;
  internalSlug?: string;
  internalType?: 'page' | 'post';
  external?: string;
};

export type SiteSettings = {
  title?: string;
  description?: string;
  logo?: string;
  defaultOgImage?: string;
  primaryNav?: Link[];
  footerNav?: Link[];
  socials?: { platform: string; url: string }[];
};

export type SeoFields = {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type HeroBlock = {
  _type: 'hero';
  _key: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  image?: SanityImage;
  ctas?: Link[];
};

export type RichTextBlock = {
  _type: 'richText';
  _key: string;
  content?: PortableTextBlock[];
};

export type CtaBlock = {
  _type: 'cta';
  _key: string;
  heading: string;
  body?: string;
  link?: Link;
};

export type FeatureGridBlock = {
  _type: 'featureGrid';
  _key: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  features?: {
    _key: string;
    title: string;
    body?: string;
    icon?: string;
  }[];
};

export type LogoCloudBlock = {
  _type: 'logoCloud';
  _key: string;
  heading?: string;
  logos?: {
    _key: string;
    name: string;
    image?: SanityImage;
    url?: string;
  }[];
};

export type TestimonialBlock = {
  _type: 'testimonial';
  _key: string;
  quote: string;
  authorName?: string;
  authorTitle?: string;
  authorImage?: SanityImage;
};

export type FaqBlock = {
  _type: 'faq';
  _key: string;
  heading?: string;
  items?: {
    _key: string;
    question: string;
    answer: PortableTextBlock[];
  }[];
};

export type Section =
  | HeroBlock
  | RichTextBlock
  | CtaBlock
  | FeatureGridBlock
  | LogoCloudBlock
  | TestimonialBlock
  | FaqBlock;

export type Page = {
  _id: string;
  title: string;
  slug: string;
  sections?: Section[];
  seo?: SeoFields;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  coverImage?: SanityImage;
  author?: { name: string; slug?: string };
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
  author?: { name: string; slug?: string; bio?: string; image?: SanityImage };
  categories?: { title: string; slug: string }[];
  seo?: SeoFields;
};
