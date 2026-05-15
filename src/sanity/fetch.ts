import 'server-only';
import { draftMode } from 'next/headers';
import type { QueryParams } from 'next-sanity';
import { client } from './client';
import { draftClient } from './draftClient';

/**
 * Server-only Sanity fetch with Next.js cache tags.
 *
 * When Next draft mode is enabled (via /api/draft-mode/enable) this routes
 * through the draft client: no CDN, drafts perspective, stega on. Otherwise
 * the published client is used with tag-based ISR.
 *
 * Usage:
 *   const page = await sanityFetch<Page>({
 *     query: pageBySlugQuery,
 *     params: { slug },
 *     tags: ['page', `page:${slug}`],
 *   });
 *
 * Revalidate via the /api/revalidate route on Sanity webhook.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  const isDraft = (await draftMode()).isEnabled;
  const sanityClient = isDraft ? draftClient : client;

  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate:
        isDraft || process.env.NODE_ENV === 'development' ? 0 : false,
      tags,
    },
  });
}
