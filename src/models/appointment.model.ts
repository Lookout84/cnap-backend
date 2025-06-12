import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

export const AppointmentSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  date: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(AppointmentStatus),
  notes: z.string().max(500).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  scheduleId: z.number().int().positive().nullable(),
});

export const CreateAppointmentSchema = AppointmentSchema.pick({
  serviceId: true,
  date: true,
  notes: true,
  scheduleId: true,
}).extend({
  status: z.nativeEnum(AppointmentStatus).optional(),
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial();

export const AppointmentSlotSchema = z.object({
  date: z.date(),
  serviceId: z.number().int().positive(),
  duration: z.number().int().positive(),
});

// Типи
export type Appointment = z.infer<typeof AppointmentSchema>;
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
export type AppointmentSlotInput = z.infer<typeof AppointmentSlotSchema>;