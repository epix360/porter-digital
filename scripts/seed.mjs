#!/usr/bin/env node
/**
 * Seeds a fresh Sanity dataset with:
 *   - one `siteSettings` singleton
 *   - one `page` document with slug "home" containing a hero + feature grid + CTA
 *
 * Idempotent: re-running updates the existing docs by _id (no duplicates).
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (Editor or Admin role).
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * and NEXT_PUBLIC_SANITY_API_VERSION from .env.local.
 *
 * Usage (the pnpm script handles the --env-file flag):
 *   pnpm seed
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET');
  process.exit(1);
}
if (!token) {
  console.error(
    'Missing SANITY_API_WRITE_TOKEN. Create one with Editor role at\n' +
      `  https://www.sanity.io/manage/project/${projectId}/api`,
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'My Site',
  description: 'A starter site built with the web-starter template.',
  primaryNav: [
    {
      _key: 'nav-blog',
      _type: 'link',
      label: 'Blog',
      linkType: 'external',
      external: '/blog',
    },
  ],
  footerNav: [],
  socials: [],
};

const homePage = {
  _id: 'page-home',
  _type: 'page',
  title: 'Home',
  slug: { _type: 'slug', current: 'home' },
  sections: [
    {
      _key: 'hero-1',
      _type: 'hero',
      eyebrow: 'Welcome',
      heading: 'Ship a custom marketing site in a weekend.',
      subheading:
        'A Next.js + Sanity starter wired up with a page builder, blog, SEO, and analytics — so you can focus on content and brand instead of plumbing.',
      ctas: [
        {
          _key: 'cta-primary',
          _type: 'link',
          label: 'Read the docs',
          linkType: 'external',
          external: 'https://nextjs.org/docs',
        },
        {
          _key: 'cta-secondary',
          _type: 'link',
          label: 'Open Studio',
          linkType: 'external',
          external: '/studio',
        },
      ],
    },
    {
      _key: 'features-1',
      _type: 'featureGrid',
      eyebrow: 'Built-in',
      heading: 'What you get out of the box',
      features: [
        {
          _key: 'f-1',
          title: 'Page builder',
          body: 'Compose marketing pages from typed section blocks edited in Sanity Studio.',
          icon: '🧱',
        },
        {
          _key: 'f-2',
          title: 'Blog',
          body: 'Posts, authors, categories, and a sitemap that updates itself.',
          icon: '✍️',
        },
        {
          _key: 'f-3',
          title: 'SEO + Analytics',
          body: 'Metadata, OG images, sitemap, robots, and Plausible — wired up.',
          icon: '📈',
        },
      ],
    },
    {
      _key: 'cta-1',
      _type: 'cta',
      heading: 'Ready to start?',
      body: 'Edit this page in Sanity Studio to make it yours.',
      link: {
        _key: 'cta-link',
        _type: 'link',
        label: 'Open Studio',
        linkType: 'external',
        external: '/studio',
      },
    },
  ],
};

async function main() {
  console.log(`Seeding dataset "${dataset}" in project ${projectId}...`);

  const tx = client.transaction();
  tx.createOrReplace(siteSettings);
  tx.createOrReplace(homePage);
  const result = await tx.commit();

  console.log(`✓ Wrote ${result.results.length} documents:`);
  for (const r of result.results) {
    console.log(`  - ${r.id}`);
  }
  console.log('\nVisit /studio to edit, or just run `pnpm dev` and open /');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
