import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { draftClient } from '@/sanity/draftClient';

/**
 * Called by Sanity's Presentation tool when an editor opens preview.
 *
 * Validates `?sanity-preview-secret` against SANITY_API_READ_TOKEN, then
 * sets the Next draft-mode cookie and redirects to the previewed path.
 */
export const { GET } = defineEnableDraftMode({ client: draftClient });
