import type { Settings } from 'meilisearch';

/**
 * Canonical index names.
 * Import these everywhere instead of using raw strings.
 */
export const INDEXES = {
  CONTENT: 'content',
} as const;

export type IndexName = (typeof INDEXES)[keyof typeof INDEXES];

/**
 * Meilisearch index settings.
 *
 * Call `applyIndexSettings()` from the seed script and after any
 * settings change — it's idempotent.
 *
 * Docs: https://www.meilisearch.com/docs/reference/api/settings
 */
export const INDEX_SETTINGS: Record<IndexName, Settings> = {
  [INDEXES.CONTENT]: {
    // Fields Meilisearch will search across (in priority order)
    searchableAttributes: ['title', 'excerpt', 'body', 'categories', 'author'],

    // Fields returned in search hits (omit large raw body in listings)
    displayedAttributes: ['id', 'type', 'title', 'slug', 'excerpt', 'publishedAt', 'categories', 'author', 'coverImage'],

    // Fields usable as facet filters (e.g. &filters=type:post)
    filterableAttributes: ['type', 'categories', 'author', 'publishedAt'],

    // Default sort for keyword results — boost recent content
    sortableAttributes: ['publishedAt'],

    // Tune ranking: words → typos → proximity → recency
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'publishedAt:desc',
    ],

    // Typo tolerance: one typo allowed for words 5+ chars
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: { oneTypo: 5, twoTypos: 9 },
    },

    // Highlighted snippets use these fields
    pagination: { maxTotalHits: 200 },
  },
};
