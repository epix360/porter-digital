import type { MetadataRoute } from 'next';
import { client } from '@/sanity/client';
import { allPageSlugsQuery, allPostSlugsQuery } from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const [pageSlugs, postSlugs] = await Promise.all([
    client.fetch<string[]>(allPageSlugsQuery),
    client.fetch<string[]>(allPostSlugsQuery),
  ]);

  const pages: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${baseUrl}/${slug === 'home' ? '' : slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: slug === 'home' ? 1 : 0.8,
  }));

  const blogIndex: MetadataRoute.Sitemap = postSlugs.length
    ? [{ url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 }]
    : [];

  const posts: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...blogIndex, ...posts];
}
