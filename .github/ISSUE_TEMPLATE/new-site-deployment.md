---
name: New Site Deployment
about: Checklist for spinning up a new site from the web-starter template
title: 'Deploy: [site name]'
labels: deployment
---

## Project info

- **Site name:**
- **Domain:**
- **Sanity Project ID:**
- **Vercel Project URL:**
- **Plausible URL:** https://plausible.io/{domain}

## Required services

### Repo & local setup
- [ ] Repo created from `web-starter` template
- [ ] `scripts/new-project.sh` run successfully
- [ ] `pnpm dev` runs without errors
- [ ] `/studio` loads locally

### Sanity
- [ ] Project created
- [ ] Dataset created (`production`)
- [ ] CORS origins added for: localhost:3000, preview URL, production domain
- [ ] Read token created and added to env (`SANITY_API_READ_TOKEN`)
- [ ] Revalidate webhook configured with secret
- [ ] Site Settings document seeded
- [ ] Home page (`slug: home`) created and published

### Plausible
- [ ] Site added at plausible.io
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` set in Vercel
- [ ] Script verified loading on production (DevTools → Network)

### Vercel
- [ ] Project linked
- [ ] Env vars pushed (all from `.env.local`)
- [ ] Production deployment succeeds
- [ ] Custom domain attached
- [ ] DNS records pointing correctly
- [ ] SSL certificate issued

### SEO
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] `/sitemap.xml` returns valid XML
- [ ] `/robots.txt` looks correct
- [ ] Default OG image set in Site Settings
- [ ] Submitted sitemap to Google Search Console

## Optional services

### Supabase (if used)
- [ ] Project created
- [ ] Schema migrated
- [ ] RLS policies enabled on all public tables
- [ ] Env vars in Vercel

### Resend (if used)
- [ ] Domain added and verified (SPF, DKIM, DMARC)
- [ ] `RESEND_FROM_EMAIL` set
- [ ] Test email sent successfully

### Tally (if used)
- [ ] Forms created
- [ ] Webhook configured (if needed)
- [ ] `TALLY_WEBHOOK_SECRET` set in Vercel

## Launch
- [ ] Smoke-tested all critical paths
- [ ] Lighthouse score acceptable (≥90 across the board)
- [ ] Analytics receiving events
- [ ] Client given Studio access (if applicable)
