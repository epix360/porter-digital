import { defineType, defineField } from 'sanity';

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'features',
      type: 'array',
      validation: (r) => r.min(1).max(12),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 3 }),
            defineField({
              name: 'icon',
              type: 'string',
              description: 'Optional emoji or icon identifier (renderer-defined).',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: 'Feature Grid', subtitle: heading }),
  },
});
