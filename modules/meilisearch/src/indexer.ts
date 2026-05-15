import 'server-only';
import { toPlainText } from '@portabletext/toolkit';
import { meiliAdmin } from './client';
import { INDEXES } from './indexes';

// ---- Shared document shape stored in Meilisearch ----

export type SearchDocument = {
  /** Meilisearch primary key — <type>:<sanityId> */
  id: string;
  type: 'page' | 'post';
  title: string;
  slug: string;
  excerpt?: string;
  /** Plain text extracted from Portable Text body */
  body?: string;
  publishedAt?: string;
  categories?: string[];
  author?: string;
  coverImage?: string;
};

// ---- Sanity document shapes (minimal — match your GROQ projections) ----

type SanityPost = {
  _id: string;
  _type: 'post';
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: unknown[];
  publishedAt?: string;
  coverImage?: { asset: { url: string } };
  author?: { name: string };
  categories?: { title: string }[];
};

type SanityPage = {
  _id: string;
  _type: 'page';
  title: string;
  slug: { current: string };
  // Flatten section text for indexing if desired
  sections?: Array<{ heading?: string; subheading?: string; body?: unknown[] }>;
};

// ---- Shaping helpers ----

export function shapePost(doc: SanityPost): SearchDocument {
  return {
    id: `post:${doc._id}`,
    type: 'post',
    title: doc.title,
    slug: doc.slug.current,
    excerpt: doc.excerpt,
    body: doc.body ? toPlainText(doc.body as Parameters<typeof toPlainText>[0]) : undefined,
    publishedAt: doc.publishedAt,
    categories: doc.categories?.map((c) => c.title),
    author: doc.author?.name,
    coverImage: doc.coverImage?.asset?.url,
  };
}

export function shapePage(doc: SanityPage): SearchDocument {
  const bodyParts: string[] = [];
  for (const section of doc.sections ?? []) {
    if (section.heading) bodyParts.push(section.heading);
    if (section.subheading) bodyParts.push(section.subheading);
    if (section.body) {
      bodyParts.push(toPlainText(section.body as Parameters<typeof toPlainText>[0]));
    }
  }
  return {
    id: `page:${doc._id}`,
    type: 'page',
    title: doc.title,
    slug: doc.slug.current,
    body: bodyParts.join(' ') || undefined,
  };
}

// ---- Index operations ----

const index = () => meiliAdmin.index(INDEXES.CONTENT);

/**
 * Upsert a single document. Called from the revalidate webhook on publish.
 */
export async function upsertDocument(doc: SearchDocument) {
  await index().addDocuments([doc], { primaryKey: 'id' });
}

/**
 * Delete a single document by Sanity _type + _id. Called on unpublish/delete.
 */
export async function deleteDocument(type: 'page' | 'post', sanityId: string) {
  await index().deleteDocument(`${type}:${sanityId}`);
}

/**
 * Bulk upsert — used by the seed script.
 */
export async function bulkUpsert(docs: SearchDocument[]) {
  if (!docs.length) return;
  const task = await index().addDocuments(docs, { primaryKey: 'id' });
  return task;
}
