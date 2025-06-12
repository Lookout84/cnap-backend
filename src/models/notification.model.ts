import { z } from 'zod';
import { NotificationType } from '@prisma/client';

export const NotificationSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(5).max(100),
  message: z.string().min(5).max(500),
  isRead: z.boolean(),
  relatedId: z.number().int().positive().nullable(),
  relatedType: z.string().max(50).nullable(),
  createdAt: z.date(),
  readAt: z.date().nullable(),
});

export const CreateNotificationSchema = NotificationSchema.pick({
  userId: true,
  type: true,
  title: true,
  message: true,
  relatedId: true,
  relatedType: true,
});

export const MarkAsReadSchema = z.object({
  isRead: z.boolean(),
});

// Типи
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;