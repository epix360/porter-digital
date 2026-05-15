import Link from 'next/link';
import { resolveLink } from '@/lib/seo';
import type { SiteSettings } from '@/lib/types';

export function Header({ settings }: { settings: SiteSettings | null }) {
  return (
    <header className="border-b border-neutral-200">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-medium">
          {settings?.title || 'Site'}
        </Link>
        <nav className="flex items-center gap-6">
          {settings?.primaryNav?.map((link, i) => (
            <Link
              key={i}
              href={resolveLink(link)}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className="text-sm text-neutral-700 hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
