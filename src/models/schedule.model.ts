import { z } from 'zod';
import { DayOfWeek } from '@prisma/client'; // Припускаючи, що ви визначили DayOfWeek enum у Prisma

export const ScheduleSchema = z.object({
  id: z.number().int().positive(),
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Невірний формат часу. Використовуйте HH:MM',
  }),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Невірний формат часу. Використовуйте HH:MM',
  }),
  isRecurring: z.boolean().default(true),
  operatorId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateScheduleSchema = ScheduleSchema.pick({
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  isRecurring: true,
  operatorId: true,
  serviceId: true,
}).extend({
  // Додаткові поля для створення, якщо потрібно
  exceptions: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(), // Дати виключень у форматі YYYY-MM-DD
});

export const UpdateScheduleSchema = CreateScheduleSchema.partial();

export const ScheduleExceptionSchema = z.object({
  scheduleId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isAvailable: z.boolean().default(false),
  reason: z.string().max(200).optional(),
});

export const GetScheduleSlotsSchema = z.object({
  serviceId: z.number().int().positive(),
  operatorId: z.number().int().positive().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.number().int().positive(), // Тривалість у хвилинах
});

export const ScheduleWithRelations = ScheduleSchema.extend({
  operator: z.object({
    id: z.number().int().positive(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  service: z.object({
    id: z.number().int().positive(),
    title: z.string(),
    duration: z.number().int().positive(),
  }),
});

// Типи для TypeScript
export type Schedule = z.infer<typeof ScheduleSchema>;
export type CreateScheduleInput = z.infer<typeof CreateScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof UpdateScheduleSchema>;
export type ScheduleException = z.infer<typeof ScheduleExceptionSchema>;
export type GetScheduleSlotsInput = z.infer<typeof GetScheduleSlotsSchema>;
export type ScheduleWithRelations = z.infer<typeof ScheduleWithRelations>;