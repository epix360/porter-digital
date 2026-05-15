import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

type WebhookPayload = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 });
    }

    // Revalidate the document type
    revalidateTag(body._type);

    // Revalidate specific document if slug is present
    if (body.slug?.current) {
      revalidateTag(`${body._type}:${body.slug.current}`);
    }

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    console.error('Revalidation error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
