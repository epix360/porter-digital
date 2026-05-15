# Meilisearch Module

Full-text search for pages and posts, indexed via the existing Sanity webhook pipeline.

## Install

```bash
pnpm add meilisearch @meilisearch/instant-meilisearch instantsearch.js react-instantsearch
```

Add to `.env.local`:

```
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_ADMIN_KEY=           # server-only — indexes + manages
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=  # public — search only
```

For Meilisearch Cloud, both HOST values will be the same
cloud URL (e.g. https://ms-xyz.meilisearch.io).

## Copy in

```
src/lib/meilisearch/
├── client.ts          # Admin client (server-only)
├── indexer.ts         # Document shaping + upsert/delete helpers
└── indexes.ts         # Index names + settings (facets, ranking)
src/components/Search.tsx          # Client-side search UI
src/app/search/page.tsx            # /search route
src/app/api/revalidate/route.ts    # ← replace with the version below
```

## How indexing works

Your existing `/api/revalidate` Sanity webhook is extended to also
index or delete documents in Meilisearch whenever content changes:

```
Sanity publish/unpublish
  → POST /api/revalidate
    → revalidateTag(...)          ← existing ISR
    → meilisearch upsert/delete   ← new
```

No separate cron or build step needed.

## Local dev

```bash
# Run Meilisearch locally with Docker
docker run -p 7700:7700 \
  -e MEILI_MASTER_KEY=your-master-key \
  getmeili/meilisearch:latest
```

Then seed the index from existing Sanity content:

```bash
npx tsx scripts/seed-search.ts
```

## Self-hosting in production

Meilisearch publishes a Docker image suitable for a $6/mo Fly.io
or Railway instance. Persist the data volume and set
`MEILI_MASTER_KEY` via your host's secret manager.

Alternatively, use Meilisearch Cloud (meilisearch.com/cloud) —
the free tier supports up to 100k documents and 10k searches/month,
which covers most marketing sites comfortably.

## API key strategy

Generate two keys in the Meilisearch dashboard (or via API):

| Key            | Permissions            | Used where      |
|----------------|------------------------|-----------------|
| Admin key      | All                    | Server only     |
| Search key     | search on specific indexes | Browser OK  |

Never expose the admin key to the browser.
