# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at :3000, Sanity Studio at :3000/studio
pnpm build        # production build
pnpm lint         # ESLint via next lint
pnpm typecheck    # tsc --noEmit (no emit, type errors only)
pnpm format       # Prettier over all files
pnpm sanity:types # regenerate src/sanity/types.ts from schemas
pnpm seed         # seed Sanity with siteSettings + a home page (needs SANITY_API_WRITE_TOKEN)
pnpm new-project  # provisioning script (Sanity + Vercel + env vars)
```

There are no tests. `typecheck` and `lint` are the verification steps.

## Architecture

**CMS-driven routing.** Marketing pages live in Sanity, not as files in `app/`. The `src/app/(site)/[[...slug]]/page.tsx` catch-all resolves any `page` document by slug. The slug `home` maps to `/`. Do not create new route files for content pages.

**Page builder.** Each page has a `sections` array of typed block objects. The rendering pipeline is:
1. GROQ query returns the sections array (in `src/sanity/queries/index.ts`)
2. `Sections.tsx` switches on `section._type` and delegates to the matching block component
3. Block components live in `src/components/blocks/`

**Adding a new block type** requires four coordinated changes:
1. Schema: `src/sanity/schemas/objects/blocks/<name>.ts`
2. Register the schema in `src/sanity/schemas/index.ts` and add it to the `sections` array field in `src/sanity/schemas/documents/page.ts`
3. Add fields to the relevant GROQ query in `src/sanity/queries/index.ts`
4. Create renderer in `src/components/blocks/<Name>.tsx` and add a `case` in `Sections.tsx`

**Data fetching.** All Sanity reads go through `sanityFetch` (`src/sanity/fetch.ts`). It is server-only and switches between the published client and the draft client based on `draftMode()`. The published client uses Next.js cache tags for ISR; the draft client bypasses the cache and emits stega markers. In development it always revalidates (`revalidate: 0`). Cache tags follow the convention `<type>` and `<type>:<slug>` (e.g. `['page', 'page:about']`).

**Preview / draft mode.** Sanity's Presentation tool (configured in `sanity.config.ts`) hits `/api/draft-mode/enable` with a signed secret to flip Next into draft mode. `(site)/layout.tsx` then renders `<VisualEditing />` and a banner with an exit link. Requires `SANITY_API_READ_TOKEN`.

**ISR revalidation.** Sanity webhooks POST to `/api/revalidate`, which calls `revalidateTag()` for the affected document type and slug. The webhook must include `SANITY_REVALIDATE_SECRET` in the request header.

**Types.** `src/lib/types.ts` is the source of truth for the template's schemas. Once a downstream project diverges its schema, run `pnpm sanity:types` to regenerate `src/sanity/types.ts` from the live schema and migrate imports to that file (it's gitignored — each project owns its generated types).

**SEO.** Use `buildMetadata()` from `src/lib/seo.ts` in every route's `generateMetadata`. Use `resolveLink()` from the same file for all internal/external link resolution — it handles the `home` → `/` mapping and `/blog/<slug>` routing for posts.

**Styling.** Tailwind only — no inline styles. Design tokens are CSS variables prefixed `--brand-*` defined in `src/app/globals.css`.

## Environment variables

Required: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

Local setup: `vercel env pull .env.local` to sync from Vercel. See `.env.example` for all vars including optional module vars.

## Optional modules

Modules in `modules/` are copy-in — they are not active until their source is copied into `src/`. Each has a `README.md` with instructions. Delete the corresponding section of `.env.example` for any module not in use.

- `modules/supabase` — Supabase client (browser, server, admin)
- `modules/resend` — Resend email client + React Email template
- `modules/tally` — Tally embed component + webhook handler
