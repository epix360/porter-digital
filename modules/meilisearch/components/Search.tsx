'use client';

import { useState, useEffect, useRef } from 'react';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  useInstantSearch,
  Configure,
} from 'react-instantsearch';
import Link from 'next/link';
import { INDEXES } from '@/lib/meilisearch/indexes';
import type { SearchDocument } from '@/lib/meilisearch/indexer';

// ---- Meilisearch public client (search-key only) ----
const { searchClient } = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST!,
  process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY!,
  { placeholderSearch: false, primaryKey: 'id' },
);

// ---- Hit component ----
type HitProps = { hit: SearchDocument & Record<string, unknown> };

function Hit({ hit }: HitProps) {
  const href = hit.type === 'post' ? `/blog/${hit.slug}` : `/${hit.slug === 'home' ? '' : hit.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-lg px-4 py-3 hover:bg-neutral-50"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
          {hit.type}
        </span>
        <span className="text-sm font-medium text-neutral-900 group-hover:text-brand-700">
          <Highlight attribute="title" hit={hit} />
        </span>
      </div>
      {hit.excerpt && (
        <p className="line-clamp-1 text-xs text-neutral-500">
          <Highlight attribute="excerpt" hit={hit} />
        </p>
      )}
    </Link>
  );
}

// ---- Empty / loading states ----
function EmptyState() {
  const { results } = useInstantSearch();
  if (!results?.query) return null;
  return (
    <p className="px-4 py-6 text-center text-sm text-neutral-500">
      No results for &ldquo;{results.query}&rdquo;
    </p>
  );
}

// ---- Main Search component ----
type SearchProps = {
  /** Render as a full-page search experience (default: false = floating panel) */
  fullPage?: boolean;
  /** Filter to a specific content type */
  filterType?: 'post' | 'page';
};

export function Search({ fullPage = false, filterType }: SearchProps) {
  const [open, setOpen] = useState(fullPage);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (fullPage) return;
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [fullPage]);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    if (fullPage) return;
    function handle(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [fullPage]);

  const filters = filterType ? `type = ${filterType}` : undefined;

  const inner = (
    <InstantSearch searchClient={searchClient} indexName={INDEXES.CONTENT}>
      <Configure hitsPerPage={fullPage ? 20 : 6} filters={filters} />
      <SearchBox
        placeholder="Search…"
        autoFocus={open}
        classNames={{
          root: 'relative',
          form: 'flex items-center',
          input:
            'w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          submit: 'absolute right-3 text-neutral-400',
          reset: 'absolute right-8 text-neutral-400',
          submitIcon: 'h-4 w-4',
          resetIcon: 'h-3.5 w-3.5',
        }}
      />
      <div className={fullPage ? 'mt-4' : 'absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-neutral-200 bg-white shadow-lg'}>
        <Hits
          hitComponent={Hit}
          classNames={{
            root: 'py-1',
            list: 'divide-y divide-neutral-50',
            item: 'list-none',
            emptyRoot: 'hidden',
          }}
        />
        <EmptyState />
      </div>
    </InstantSearch>
  );

  if (fullPage) {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search…</span>
          <kbd className="ml-auto rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">⌘K</kbd>
        </button>
      ) : (
        inner
      )}
    </div>
  );
}
