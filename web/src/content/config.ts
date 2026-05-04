import { defineCollection, z } from 'astro:content';

const programs = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    code:        z.string(),
    titleEl:     z.string(),
    titleEn:     z.string(),
    audience:    z.enum(['individual', 'business', 'parent']),
    category:    z.enum(['life-support', 'first-aid', 'pediatric', 'workplace', 'comprehensive']),
    durationHours: z.string(),
    evaluation: z.string(),
    evaluationNote: z.string().optional(),
    priceEur:   z.number().optional(),
    summary:    z.string(),
    description: z.string(),
    prerequisite: z.string().optional(),
    theory:     z.array(z.string()),
    skills:     z.array(z.string()),
    heroImage:  image(),
    badgeImage: image().optional(),
    galleryImages: z.array(image()).default([]),
    tags:       z.array(z.string()).default([]),
    order:      z.number().default(99),
    featured:   z.boolean().default(false),
  }),
});

const clients = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name:  z.string(),
    logo:  image(),
    url:   z.string().url().optional(),
    sector: z.string().optional(),
  }),
});

const credentials = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    title:    z.string(),
    issuer:   z.string(),
    yearIssued: z.number().optional(),
    summary:  z.string().optional(),
    image:    image(),
    order:    z.number().default(99),
  }),
});

export const collections = { programs, clients, credentials };
