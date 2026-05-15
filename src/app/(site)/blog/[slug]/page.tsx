import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { sanityFetch } from '@/sanity/fetch';
import { client } from '@/sanity/client';
import { postBySlugQuery, allPostSlugsQuery, siteSettingsQuery } from '@/sanity/queries';
import { buildMetadata } from '@/lib/seo';
import { portableTextComponents } from '@/components/PortableText';
import { SanityImage } from '@/components/SanityImage';
import type { Post, SiteSettings } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allPostSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    sanityFetch<Post | null>({
      query: postBySlugQuery,
      params: { slug },
      tags: [`post:${slug}`],
    }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ]);

  if (!post) return {};

  return buildMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    ogImage: post.seo?.ogImage || settings?.defaultOgImage,
    noIndex: post.seo?.noIndex,
    canonical: `/blog/${slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
  });
}

export default async function PostRoute({ params }: Props) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  });

  if (!post) notFound();

  return (
    <article className="container max-w-3xl py-16">
      <header className="mb-10">
        <h1 className="font-display text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-text-muted">
          {post.author && <span>{post.author.name}</span>}
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>
        {post.coverImage?.asset && (
          <div className="mt-8 overflow-hidden rounded-xl">
            <SanityImage
              image={post.coverImage}
              width={1200}
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="h-auto w-full"
            />
          </div>
        )}
      </header>
      <div className="prose prose-neutral max-w-none">
        {post.body && <PortableText value={post.body} components={portableTextComponents} />}
      </div>
    </article>
  );
}
