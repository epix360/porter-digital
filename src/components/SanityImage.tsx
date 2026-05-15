import Image, { type ImageProps } from 'next/image';
import { urlForImage } from '@/sanity/image';
import type { SanityImage as SanityImageType } from '@/lib/types';

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> & {
  image: SanityImageType | undefined | null;
  alt?: string;
  width?: number;
  height?: number;
};

/**
 * Renders a Sanity image via next/image.
 *
 * Width/height come from `asset.metadata.dimensions` (fetched via the
 * `imageFields` GROQ fragment). If a `width` prop is provided, the image is
 * served at that width and the height is scaled to preserve aspect ratio.
 */
export function SanityImage({ image, alt, width, height, sizes, className, ...rest }: Props) {
  if (!image?.asset) return null;

  const dims = image.asset.metadata?.dimensions;
  const aspectRatio = dims?.aspectRatio || (dims ? dims.width / dims.height : 1);

  const resolvedWidth = width ?? dims?.width ?? 1200;
  const resolvedHeight = height ?? Math.round(resolvedWidth / aspectRatio);

  const src = urlForImage(image).width(resolvedWidth).height(resolvedHeight).url();
  const lqip = image.asset.metadata?.lqip;

  return (
    <Image
      src={src}
      alt={alt ?? image.alt ?? ''}
      width={resolvedWidth}
      height={resolvedHeight}
      sizes={sizes}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      className={className}
      {...rest}
    />
  );
}
