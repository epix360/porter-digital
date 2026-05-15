import 'server-only';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, readToken } from './env';

/**
 * Client used when Next.js draft mode is enabled. Bypasses the CDN, reads
 * drafts, and emits stega source markers so Sanity's Presentation tool can
 * overlay edit links on the rendered page.
 *
 * Requires SANITY_API_READ_TOKEN (Viewer or Editor role).
 */
export const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'drafts',
  token: readToken,
  stega: { enabled: true, studioUrl: '/studio' },
});
