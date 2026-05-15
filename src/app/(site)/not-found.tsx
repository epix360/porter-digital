import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-brand-700">404</p>
      <h1 className="mt-4 font-display text-4xl">Page not found</h1>
      <p className="mt-4 max-w-prose text-neutral-600">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  );
}
