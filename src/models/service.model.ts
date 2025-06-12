import { z } from 'zod';
import { ServiceStatus } from '@prisma/client';

export const ServiceSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  categoryId: z.number().int().positive(),
  duration: z.number().int().positive().max(480), // Максимум 8 годин
  price: z.number().nonnegative().nullable(),
  status: z.nativeEnum(ServiceStatus),
  requiredDocuments: z.array(z.string()).nonempty(),
  onlineAvailable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  managerId: z.number().int().positive().nullable(),
});

export const CreateServiceSchema = ServiceSchema.pick({
  title: true,
  description: true,
  categoryId: true,
  duration: true,
  price: true,
  requiredDocuments: true,
  onlineAvailable: true,
  managerId: true,
}).extend({
  status: z.nativeEnum(ServiceStatus).optional(),
});

export const UpdateServiceSchema = CreateServiceSchema.partial();

export const ServiceCategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3).max(50),
  description: z.string().max(500).nullable(),
  slug: z.string().min(3).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateServiceCategorySchema = ServiceCategorySchema.pick({
  name: true,
  description: true,
  slug: true,
});

export const UpdateServiceCategorySchema = CreateServiceCategorySchema.partial();

// Типи
export type Service = z.infer<typeof ServiceSchema>;
export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type CreateServiceCategoryInput = z.infer<typeof CreateServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof UpdateServiceCategorySchema>;