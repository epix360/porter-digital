/**
 * /api/revalidate — extended with Meilisearch indexing.
 *
 * DROP-IN replacement for src/app/api/revalidate/route.ts when using
 * the Meilisearch module. Copy this file to that location.
 *
 * On every Sanity publish/unpublish:
 *   1. Revalidates Next.js cache tags (existing behaviour)
 *   2. Upserts or deletes the document in Meilisearch
 */

import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import {
  shapePost,
  shapePage,
  upsertDocument,
  deleteDocument,
} from '@/lib/meilisearch/indexer';

type WebhookPayload = {
  _id: string;
  _type: string;
  slug?: { current?: string };
  // Sanity sends operation on the webhook
  operation?: 'create' | 'update' | 'delete';
};

// GROQ projections — must match the SanityPost/SanityPage types in indexer.ts
const POST_PROJECTION = groq`{
  _id, _type, title, slug, excerpt, body, publishedAt,
  "coverImage": coverImage { asset->{ url } },
  "author": author->{ name },
  "categories": categories[]->{ title }
}`;

const PAGE_PROJECTION = groq`{
  _id, _type, title, slug,
  sections[]{ heading, subheading, body }
}`;

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    if (!body?._type || !body?._id) {
      return new NextResponse('Bad request', { status: 400 });
    }

    const { _id, _type, slug, operation } = body;

    // 1. ISR cache invalidation (existing behaviour)
    revalidateTag(_type);
    if (slug?.current) revalidateTag(`${_type}:${slug.current}`);

    // 2. Meilisearch indexing
    const isDelete = operation === 'delete';

    if (isDelete) {
      if (_type === 'post' || _type === 'page') {
        await deleteDocument(_type, _id);
      }
    } else if (_type === 'post') {
      const doc = await client.fetch(`*[_id == $id][0]${POST_PROJECTION}`, { id: _id });
      if (doc) await upsertDocument(shapePost(doc));
    } else if (_type === 'page') {
      const doc = await client.fetch(`*[_id == $id][0]${PAGE_PROJECTION}`, { id: _id });
      if (doc) await upsertDocument(shapePage(doc));
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      indexed: _type === 'post' || _type === 'page',
    });
  } catch (err) {
    console.error('Revalidation/indexing error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
