import type { Metadata } from 'next';

type BuildMetadataArgs = {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
};

export function buildMetadata({
  title,
  description,
  ogImage,
  noIndex,
  canonical,
  type = 'website',
  publishedTime,
}: BuildMetadataArgs): Metadata {
  const meta: Metadata = {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
  return meta;
}

/**
 * Resolve a link object to an href string.
 */
export function resolveLink(link?: {
  linkType?: 'internal' | 'external';
  internalSlug?: string;
  internalType?: 'page' | 'post';
  external?: string;
}): string {
  if (!link) return '#';
  if (link.linkType === 'external') return link.external || '#';
  if (!link.internalSlug) return '#';
  if (link.internalType === 'post') return `/blog/${link.internalSlug}`;
  return link.internalSlug === 'home' ? '/' : `/${link.internalSlug}`;
}
