import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendErrorResponse(
        res,
        'Authentication required',
        StatusCodes.UNAUTHORIZED
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        'You do not have permission to access this resource',
        StatusCodes.FORBIDDEN
      );
    }

    next();
  };
};

export const selfOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return sendErrorResponse(
      res,
      'Authentication required',
      StatusCodes.UNAUTHORIZED
    );
  }

  const requestedUserId = parseInt(req.params.userId);
  if (isNaN(requestedUserId)) {
    return sendErrorResponse(res, 'Invalid user ID', StatusCodes.BAD_REQUEST);
  }

  if (req.user.id !== requestedUserId && req.user.role !== 'ADMINISTRATOR') {
    return sendErrorResponse(
      res,
      'You can only access your own data',
      StatusCodes.FORBIDDEN
    );
  }

  next();
};