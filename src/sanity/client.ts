import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from './env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` if you want to ensure fresh data
  perspective: 'published',
  // Stega encodes source markers into string fields for Visual Editing.
  // Keep it off in the default published client so production HTML stays clean.
  // Wire up a separate draft client (with a read token and stega.enabled: true)
  // when adding preview mode.
  stega: { enabled: false },
});
