import 'server-only';
import { MeiliSearch } from 'meilisearch';

function assertValue<T>(v: T | undefined, message: string): T {
  if (v === undefined) throw new Error(message);
  return v;
}

/**
 * Server-only Meilisearch admin client.
 * Has full permissions: create/delete indexes, add/update/delete documents.
 * Never expose MEILISEARCH_ADMIN_KEY to the browser.
 */
export const meiliAdmin = new MeiliSearch({
  host: assertValue(process.env.MEILISEARCH_HOST, 'Missing MEILISEARCH_HOST'),
  apiKey: assertValue(process.env.MEILISEARCH_ADMIN_KEY, 'Missing MEILISEARCH_ADMIN_KEY'),
});
