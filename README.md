# web-starter

Opinionated Next.js starter for the stack: **Next.js 15 + Tailwind + Sanity + Plausible + Vercel**, with optional modules for Supabase, Resend, Tally, and Meilisearch.

## What's included

- **Next.js 15 App Router** with TypeScript, ESLint, Prettier
- **Tailwind CSS** with CSS-variable design tokens, custom container, font scale
- **Sanity Studio** embedded at `/studio` with schemas for pages, posts, authors, categories, site settings, SEO
- **Page builder** with Hero / Rich Text / CTA blocks (extensible)
- **Plausible analytics** wired up via env var
- **Webhook-driven ISR** at `/api/revalidate` with tag-based cache invalidation
- **SEO defaults**: metadata API, sitemap, robots.txt, per-page OG images
- **Provisioning script** that handles Sanity + Vercel + env vars in one command

## Quick start (new project)

```bash
# 1. Use this repo as a GitHub template (one click in GitHub UI)
gh repo create my-new-site --template your-org/web-starter --private --clone
cd my-new-site

# 2. Provision (creates Sanity project, links Vercel, sets env vars)
pnpm new-project

# 3. Develop
pnpm dev          # site at :3000, studio at :3000/studio
```

See `.github/ISSUE_TEMPLATE/new-site-deployment.md` for the full deployment checklist — create an issue from this template at the start of every new project.

## Adding optional modules

Each lives in `modules/` and ships with its own README:

```bash
# Database
cat modules/supabase/README.md
cp -r modules/supabase/src src/lib/supabase

# Email
cat modules/resend/README.md
cp -r modules/resend/src src/lib/resend
cp -r modules/resend/emails ./emails

# Forms
cat modules/tally/README.md
cp modules/tally/src/TallyEmbed.tsx src/components/
cp modules/tally/src/route.ts src/app/api/tally/route.ts
```

Delete the corresponding section of `.env.example` for any module you don't use.

## Project structure

```
src/
├── app/
│   ├── (site)/                Marketing site routes (shares header/footer)
│   │   ├── [[...slug]]/       CMS-driven catch-all pages
│   │   ├── blog/              Blog index + post pages
│   │   └── layout.tsx
│   ├── api/revalidate/        Sanity webhook → revalidateTag()
│   ├── studio/[[...tool]]/    Embedded Sanity Studio
│   ├── layout.tsx             Root layout + Plausible
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── blocks/                Section renderers (Hero, RichText, Cta, Sections)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── PortableText.tsx
├── lib/
│   ├── types.ts               Shared TS types (replace with sanity typegen output)
│   └── seo.ts                 Metadata builder, link resolver
└── sanity/
    ├── client.ts              Sanity client
    ├── fetch.ts               Server-only fetch with cache tags
    ├── env.ts                 Env var validation
    ├── image.ts               Image URL builder
    ├── schemas/               Document + object schemas
    └── queries/               GROQ queries

modules/                       Optional, copy-in modules
scripts/new-project.sh         Provisioning automation
```

## Conventions

- **Routes are CMS-driven.** New marketing pages are created in Sanity, not as new files in `app/`. The `[[...slug]]` route renders any page document.
- **Sections are blocks.** To add a new page section type: create a schema in `src/sanity/schemas/objects/blocks/`, register it in `schemas/index.ts` and the `page` schema's `sections` array, then create a renderer in `src/components/blocks/` and wire it into `Sections.tsx`.
- **Cache tags = document type + slug.** The revalidate webhook invalidates `post`, `post:my-slug`, etc. Use these in your `sanityFetch` calls.
- **Types.** `src/lib/types.ts` covers the schemas the template ships with. Run `pnpm sanity:types` once you diverge your own schema to generate `src/sanity/types.ts` from your live project, then switch imports over — the generated file is gitignored so each project owns its own.
- **Env vars are managed in Vercel.** Use `vercel env pull .env.local` to sync.

## Versioning

This template uses semver. Tag releases and note breaking changes in `CHANGELOG.md` so downstream sites know what they're inheriting from.
