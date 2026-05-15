import Link from 'next/link';
import { resolveLink } from '@/lib/seo';
import type { SiteSettings } from '@/lib/types';

export function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="border-t border-border bg-surface-muted py-12">
      <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} {settings?.title || 'Site'}
        </p>
        <nav className="flex flex-wrap gap-4">
          {settings?.footerNav?.map((link, i) => (
            <Link
              key={i}
              href={resolveLink(link)}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className="text-sm text-text-muted transition-colors hover:text-accent-700"
            >
              {link.label}
            </Link>
          ))}
          {settings?.socials?.map((s, i) => (
            <a
              key={`s-${i}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted transition-colors hover:text-accent-700"
            >
              {s.platform}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
