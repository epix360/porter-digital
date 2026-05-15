import { defineType, defineField } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({
      name: 'items',
      type: 'array',
      validation: (r) => r.min(1),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'answer',
              type: 'array',
              of: [{ type: 'block' }],
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: 'FAQ', subtitle: heading }),
  },
});
