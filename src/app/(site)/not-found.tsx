import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-accent-700">404</p>
      <h1 className="mt-4 font-display text-4xl text-brand-600">Page not found</h1>
      <p className="mt-4 max-w-prose text-text-muted">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-accent-600 px-5 py-2.5 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-700"
      >
        Back to home
      </Link>
    </div>
  );
}
