import { z } from 'zod';

export const DocumentSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  appointmentId: z.number().int().positive().nullable(),
  documentType: z.string().min(2).max(50),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  isValid: z.boolean(),
  verifiedById: z.number().int().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UploadDocumentSchema = DocumentSchema.pick({
  documentType: true,
  appointmentId: true,
}).extend({
  file: z.any(), // Для завантаження файлу
});

export const VerifyDocumentSchema = z.object({
  isValid: z.boolean(),
});

// Типи
export type Document = z.infer<typeof DocumentSchema>;
export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
export type VerifyDocumentInput = z.infer<typeof VerifyDocumentSchema>;