import type { Metadata } from 'next';
import { Search } from '@/components/Search';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-display text-4xl">Search</h1>
      <p className="mt-3 text-neutral-600">Find pages and posts across the site.</p>
      <div className="mt-8">
        <Search fullPage />
      </div>
    </div>
  );
}
