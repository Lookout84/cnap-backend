import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendValidationError } from '../utils/apiResponse.util';
import { logger } from '../utils/logger.util';

export const validate = <T extends z.ZodTypeAny>(
  schema: T,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[property]);

      if (!result.success) {
        logger.warn('Validation failed', { errors: result.error.flatten() });
        return sendValidationError(res, result.error.flatten().fieldErrors);
      }

      req.validatedData = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return sendValidationError(res, { file: ['File is required'] });
  }

  next();
};

export const validateFilesUpload = (
  fieldName: string,
  maxCount: number = 5
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !(req.files as any)[fieldName]?.length) {
      return sendValidationError(res, {
        [fieldName]: [`At least one file is required for ${fieldName}`],
      });
    }

    const files = (req.files as any)[fieldName];
    if (files.length > maxCount) {
      return sendValidationError(res, {
        [fieldName]: [`Maximum ${maxCount} files allowed for ${fieldName}`],
      });
    }

    next();
  };
};