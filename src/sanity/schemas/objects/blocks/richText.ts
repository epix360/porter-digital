import { defineType, defineField } from 'sanity';

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({ name: 'content', type: 'blockContent' }),
  ],
  preview: {
    prepare: () => ({ title: 'Rich Text' }),
  },
});
