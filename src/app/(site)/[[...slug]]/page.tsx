import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/fetch';
import { client } from '@/sanity/client';
import { pageBySlugQuery, allPageSlugsQuery, siteSettingsQuery } from '@/sanity/queries';
import { buildMetadata } from '@/lib/seo';
import { Sections } from '@/components/blocks/Sections';
import type { Page, SiteSettings } from '@/lib/types';

type Props = { params: Promise<{ slug?: string[] }> };

// Pre-render all pages at build time
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allPageSlugsQuery);
  return slugs.map((slug) => ({
    slug: slug === 'home' ? [] : slug.split('/'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug?.join('/') || 'home';

  const [page, settings] = await Promise.all([
    sanityFetch<Page | null>({
      query: pageBySlugQuery,
      params: { slug: slugString },
      tags: [`page:${slugString}`],
    }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ]);

  if (!page) return {};

  return buildMetadata({
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    ogImage: page.seo?.ogImage || settings?.defaultOgImage,
    noIndex: page.seo?.noIndex,
    canonical: `/${slugString === 'home' ? '' : slugString}`,
  });
}

export default async function PageRoute({ params }: Props) {
  const { slug } = await params;
  const slugString = slug?.join('/') || 'home';

  const page = await sanityFetch<Page | null>({
    query: pageBySlugQuery,
    params: { slug: slugString },
    tags: [`page:${slugString}`],
  });

  if (!page) notFound();

  return <Sections sections={page.sections || []} />;
}
