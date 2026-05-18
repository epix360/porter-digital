import { defineType, defineField } from 'sanity';

export const contactForm = defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Optional heading shown above the form.',
    }),
    defineField({
      name: 'intro',
      type: 'text',
      rows: 3,
      description: 'Optional paragraph shown between the heading and the form.',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      description: 'Defaults to "Send message" if left blank.',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'text',
      rows: 2,
      description:
        'Shown after a successful submission. Defaults to a generic thank-you if left blank.',
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: 'Contact Form',
      subtitle: heading || undefined,
    }),
  },
});
