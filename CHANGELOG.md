# Changelog

All notable changes to the `web-starter` template are documented here. Downstream sites
should track which version of the starter they're on (commit SHA or version tag) so
upgrades are deliberate.

## [Unreleased]

### Changed
- pnpm is now the canonical package manager: `packageManager: pnpm@9.12.3` pinned, `engines.node >= 20.6.0`, all docs/scripts reference `pnpm` instead of `npm`
- `package-lock.json` removed and gitignored — downstream projects generate `pnpm-lock.yaml` on first install
- `src/app/sitemap.ts` cleaned up: no more nullable mid-spread + filter; just concatenate three typed sitemap arrays
- Docs clarified that `src/lib/types.ts` is the template's source of truth (generated types are per-project and gitignored)

### Added
- Sanity Presentation tool wired up: draft/preview mode via `/api/draft-mode/enable` (and `/disable`), draft-mode banner, `<VisualEditing />` overlay in `(site)/layout.tsx`, and a dedicated draft client with stega enabled + drafts perspective
- Singleton enforcement in Sanity Studio: `siteSettings` hidden from "New document" menu and stripped of duplicate/delete/unpublish actions
- Four new page-builder blocks: `featureGrid`, `logoCloud`, `testimonial`, `faq`
- `SanityImage` component wrapping `next/image` with asset metadata (dimensions + LQIP blur)
- `pnpm seed` script that writes a `siteSettings` singleton and a `home` page so a fresh dataset renders something at `/` immediately
- Full brand color scale (50–950) plus accent / semantic surface + text tokens
- `not-found.tsx`, `error.tsx`, `loading.tsx` under `(site)/` plus a root `global-error.tsx`

### Changed
- `<img>` replaced with `SanityImage` in Hero, blog index, blog post header, and PortableText image renderer
- GROQ image fragments now request `asset->metadata { dimensions, lqip }` so next/image gets correct width/height + blur placeholder
- `Sections.tsx` warns in dev when a block `_type` has no registered renderer
- `@tailwindcss/typography` plugin enabled (prose styles in blog posts now render)
- Stega disabled in the published Sanity client; production HTML no longer contains Visual Editing source markers
- Custom fonts loaded via `next/font` (Inter / Playfair Display / JetBrains Mono) and bound to the `--font-*` CSS variables Tailwind expects

## [0.1.0] - Initial release

### Added
- Next.js 15 App Router + TypeScript + Tailwind CSS baseline
- Sanity Studio embedded at `/studio` with pages, posts, authors, categories, site settings
- Page builder with Hero / RichText / CTA blocks
- Plausible analytics integration via env var
- `/api/revalidate` webhook with tag-based cache invalidation
- Dynamic sitemap and robots.txt
- SEO metadata helper with per-page OG image support
- Provisioning script (`scripts/new-project.sh`)
- Deployment checklist as GitHub issue template
- Optional modules: Supabase, Resend, Tally
