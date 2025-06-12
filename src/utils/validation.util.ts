import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from './apiResponse.util';

export const validateRequest = <T extends z.ZodTypeAny>(
  schema: T,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[property]);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return sendValidationError(res, errors);
      }
      
      // Додаємо валідовані дані до об'єкта запиту
      req.validatedData = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^\+?\d{10,15}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 8;
};

export const validatePaginationParams = (page: number, limit: number) => {
  return page > 0 && limit > 0 && limit <= 100;
};

declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
    }
  }
}