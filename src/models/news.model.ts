import { z } from 'zod';

export const NewsSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(5).max(200),
  slug: z.string().min(5).max(200),
  content: z.string().min(10),
  excerpt: z.string().max(300).nullable(),
  imageUrl: z.string().url().nullable(),
  isPublished: z.boolean(),
  publishedAt: z.date().nullable(),
  authorId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateNewsSchema = NewsSchema.pick({
  title: true,
  content: true,
  excerpt: true,
  imageUrl: true,
  isPublished: true,
}).extend({
  slug: z.string().min(5).max(200).optional(),
});

export const UpdateNewsSchema = CreateNewsSchema.partial();

export const NewsTagSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(50),
});

// Типи
export type News = z.infer<typeof NewsSchema>;
export type CreateNewsInput = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsInput = z.infer<typeof UpdateNewsSchema>;
export type NewsTag = z.infer<typeof NewsTagSchema>;