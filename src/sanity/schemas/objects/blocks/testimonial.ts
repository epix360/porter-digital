import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'authorName', title: 'Author name', type: 'string' }),
    defineField({ name: 'authorTitle', title: 'Author title / company', type: 'string' }),
    defineField({
      name: 'authorImage',
      title: 'Author image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
  preview: {
    select: { author: 'authorName', quote: 'quote' },
    prepare: ({ author, quote }) => ({
      title: 'Testimonial',
      subtitle: author || quote?.slice(0, 60),
    }),
  },
});
