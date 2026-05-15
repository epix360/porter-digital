import { groq } from 'next-sanity';

// Fragments
const linkFields = groq`
  label,
  linkType,
  newTab,
  "internalSlug": internal->slug.current,
  "internalType": internal->_type,
  external
`;

// Image fragment — keeps the full asset ref + dimensions + LQIP placeholder
// so SanityImage can hand correct width/height + blur data to next/image.
const imageFields = groq`
  ...,
  asset->{
    _id,
    _ref,
    metadata { dimensions { width, height, aspectRatio }, lqip }
  }
`;

const seoFields = groq`
  seo {
    title,
    description,
    noIndex,
    "ogImage": ogImage.asset->url
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title,
    description,
    "logo": logo.asset->url,
    "defaultOgImage": defaultOgImage.asset->url,
    primaryNav[]{ ${linkFields} },
    footerNav[]{ ${linkFields} },
    socials[]
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    sections[]{
      _type,
      _key,
      // hero
      eyebrow,
      heading,
      subheading,
      image{ ${imageFields} },
      ctas[]{ ${linkFields} },
      // richText
      content,
      // cta
      body,
      link{ ${linkFields} },
      // featureGrid
      features[]{
        _key,
        title,
        body,
        icon
      },
      // logoCloud
      logos[]{
        _key,
        name,
        image{ ${imageFields} },
        url
      },
      // testimonial
      quote,
      authorName,
      authorTitle,
      authorImage{ ${imageFields} },
      // faq
      items[]{
        _key,
        question,
        answer
      }
    },
    ${seoFields}
  }
`;

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)][].slug.current
`;

export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage{ ${imageFields} },
    "author": author->{ name, "slug": slug.current }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage{ ${imageFields} },
    body,
    "author": author->{ name, "slug": slug.current, bio, image },
    "categories": categories[]->{ title, "slug": slug.current },
    ${seoFields}
  }
`;

export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;
