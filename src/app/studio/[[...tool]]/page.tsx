/**
 * Sanity Studio mounted at /studio.
 *
 * Page stays a server component so `metadata` / `viewport` can be
 * re-exported. The actual Studio + sanity.config import live in
 * Studio.tsx (a client component) because sanity.config uses
 * React.createContext, which is client-only.
 */

export { metadata, viewport } from 'next-sanity/studio';

export const dynamic = 'force-static';

import { Studio } from './Studio';

export default function StudioPage() {
  return <Studio />;
}
