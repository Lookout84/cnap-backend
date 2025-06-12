import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';
import { sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', { error: err });

  // Обробка помилок валідації Zod
  if (err instanceof ZodError) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation error',
      errors: err.flatten().fieldErrors,
    });
  }

  // Обробка помилок Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Обробка інших помилок
  const statusCode =
    'statusCode' in err && typeof err.statusCode === 'number'
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  return sendErrorResponse(
    res,
    err.message || 'Internal Server Error',
    statusCode
  );
};

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (err.code) {
    case 'P2002':
      return sendErrorResponse(
        res,
        'Duplicate entry - this value already exists',
        StatusCodes.CONFLICT
      );
    case 'P2025':
      return sendErrorResponse(
        res,
        'Record not found',
        StatusCodes.NOT_FOUND
      );
    default:
      return sendErrorResponse(
        res,
        'Database error occurred',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
  }
};

export const notFoundHandler = (req: Request, res: Response) => {
  sendErrorResponse(res, 'Endpoint not found', StatusCodes.NOT_FOUND);
};