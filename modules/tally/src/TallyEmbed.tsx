'use client';

type TallyEmbedProps = {
  formId: string;
  height?: number;
  hideTitle?: boolean;
  transparentBackground?: boolean;
  /** Pass hidden field values (must match field names in Tally) */
  hiddenFields?: Record<string, string>;
};

export function TallyEmbed({
  formId,
  height = 500,
  hideTitle = true,
  transparentBackground = true,
  hiddenFields,
}: TallyEmbedProps) {
  const params = new URLSearchParams();
  if (hideTitle) params.set('hideTitle', '1');
  if (transparentBackground) params.set('transparentBackground', '1');
  if (hiddenFields) {
    for (const [k, v] of Object.entries(hiddenFields)) params.set(k, v);
  }

  const src = `https://tally.so/embed/${formId}?${params.toString()}`;

  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      frameBorder={0}
      title="Form"
      style={{ border: 0 }}
    />
  );
}
