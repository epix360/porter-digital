import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import { sanityFetch } from '@/sanity/fetch';
import { siteSettingsQuery } from '@/sanity/queries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DraftModeBanner } from '@/components/DraftModeBanner';
import type { SiteSettings } from '@/lib/types';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const isDraft = (await draftMode()).isEnabled;
  const settings = await sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
  });

  return (
    <div className="flex min-h-screen flex-col">
      {isDraft && <DraftModeBanner />}
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      {isDraft && <VisualEditing />}
    </div>
  );
}
