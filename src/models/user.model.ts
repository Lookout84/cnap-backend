import { z } from 'zod';
import { UserRole } from '@prisma/client';

// Базова схема для користувача
export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  passwordHash: z.string().min(8),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().regex(/^\+?\d{10,15}$/),
  role: z.nativeEnum(UserRole),
  isVerified: z.boolean(),
  verificationToken: z.string().nullable(),
  resetToken: z.string().nullable(),
  resetTokenExpires: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для створення нового користувача
export const CreateUserSchema = UserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
}).extend({
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).optional(),
});

// Схема для оновлення користувача
export const UpdateUserSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  phone: true,
}).partial();

// Схема для зміни паролю
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

// Схема для входу в систему
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Схема для скидання паролю
export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

// Типи для TypeScript
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;