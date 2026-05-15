import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';
import { apiVersion, dataset, projectId } from './src/sanity/env';

const SINGLETON_TYPES = new Set(['siteSettings']);
// Actions to keep on singleton docs — everything else (duplicate, delete,
// unpublish) gets stripped so editors can't accidentally remove the singleton.
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

const previewUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "New document" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('post').title('Blog Posts'),
            S.documentTypeListItem('author').title('Authors'),
            S.documentTypeListItem('category').title('Categories'),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: previewUrl,
        preview: '/',
        previewMode: { enable: '/api/draft-mode/enable' },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
