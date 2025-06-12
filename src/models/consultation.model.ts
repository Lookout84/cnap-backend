import { z } from 'zod';
import { ConsultationStatus } from '@prisma/client';

export const ConsultationSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  topic: z.string().min(5).max(100),
  question: z.string().min(10).max(2000),
  answer: z.string().max(2000).nullable(),
  status: z.nativeEnum(ConsultationStatus),
  answeredById: z.number().int().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateConsultationSchema = ConsultationSchema.pick({
  topic: true,
  question: true,
});

export const UpdateConsultationSchema = ConsultationSchema.pick({
  topic: true,
  question: true,
  status: true,
}).partial();

export const AnswerConsultationSchema = z.object({
  answer: z.string().min(10).max(2000),
});

export const ConsultationAttachmentSchema = z.object({
  id: z.number().int().positive(),
  consultationId: z.number().int().positive(),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  createdAt: z.date(),
});

// Типи
export type Consultation = z.infer<typeof ConsultationSchema>;
export type CreateConsultationInput = z.infer<typeof CreateConsultationSchema>;
export type UpdateConsultationInput = z.infer<typeof UpdateConsultationSchema>;
export type AnswerConsultationInput = z.infer<typeof AnswerConsultationSchema>;
export type ConsultationAttachment = z.infer<typeof ConsultationAttachmentSchema>;