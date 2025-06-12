import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = StatusCodes.OK
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendPaginatedResponse = <T>(
  res: Response,
  data: T,
  meta: {
    page: number;
    limit: number;
    total: number;
  },
  message = 'Success'
) => {
  const totalPages = Math.ceil(meta.total / meta.limit);
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      ...meta,
      totalPages,
    },
  };
  res.status(StatusCodes.OK).json(response);
};

export const sendErrorResponse = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  errors?: unknown
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  errors: Record<string, string[]>
) => {
  const response: ApiResponse<null> = {
    success: false,
    message: 'Validation Error',
    data: null,
  };
  res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    ...response,
    errors,
  });
};