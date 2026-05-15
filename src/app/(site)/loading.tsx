export default function Loading() {
  return (
    <div className="container py-24" aria-busy="true" aria-live="polite">
      <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-100" />
      <div className="mt-6 h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
    </div>
  );
}
