import Link from 'next/link';
import { resolveLink } from '@/lib/seo';
import type { SiteSettings } from '@/lib/types';

export function Header({ settings }: { settings: SiteSettings | null }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-medium text-brand-600">
          {settings?.title || 'Site'}
        </Link>
        <nav className="flex items-center gap-6">
          {settings?.primaryNav?.map((link, i) => (
            <Link
              key={i}
              href={resolveLink(link)}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className="text-sm font-medium text-text transition-colors hover:text-accent-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
