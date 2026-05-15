'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-brand-700">Error</p>
      <h1 className="mt-4 font-display text-4xl">Something went wrong</h1>
      <p className="mt-4 max-w-prose text-neutral-600">
        An unexpected error occurred. Try again, and if the problem persists, contact support.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
