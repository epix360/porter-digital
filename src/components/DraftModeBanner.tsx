import Link from 'next/link';

export function DraftModeBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-brand-900 px-4 py-2 text-sm text-white">
      <span className="font-medium">
        Preview mode — viewing unpublished drafts
      </span>
      <Link
        href="/api/draft-mode/disable"
        prefetch={false}
        className="rounded bg-white/10 px-3 py-1 text-xs font-medium hover:bg-white/20"
      >
        Exit preview
      </Link>
    </div>
  );
}
