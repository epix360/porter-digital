import { defineType, defineField } from 'sanity';

export const logoCloud = defineType({
  name: 'logoCloud',
  title: 'Logo Cloud',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({
      name: 'logos',
      type: 'array',
      validation: (r) => r.min(1).max(24),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'image' } },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: 'Logo Cloud', subtitle: heading }),
  },
});
