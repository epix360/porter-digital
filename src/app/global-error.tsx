'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '4rem 1rem', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#525252', marginBottom: '1.5rem' }}>
            A critical error prevented the page from rendering.
            {error.digest ? ` (ref: ${error.digest})` : ''}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.25rem',
              border: '1px solid #d4d4d4',
              borderRadius: '0.375rem',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
