import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Environment } from '../config/environment.config';
import { logger } from '../utils/logger.util';
import { sendErrorResponse } from '../utils/apiResponse.util';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendErrorResponse(
      res,
      'Authorization header is missing',
      StatusCodes.UNAUTHORIZED
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendErrorResponse(
      res,
      'Authentication token is missing',
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(token, Environment.JWT_SECRET) as {
      userId: number;
      role: UserRole;
    };

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    logger.info(`User authenticated: ${decoded.userId}`);
    next();
  } catch (error) {
    logger.error('Authentication failed', { error });
    return sendErrorResponse(
      res,
      'Invalid or expired token',
      StatusCodes.UNAUTHORIZED
    );
  }
};

export const authenticateOptional = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, Environment.JWT_SECRET) as {
          userId: number;
          role: UserRole;
        };

        req.user = {
          id: decoded.userId,
          role: decoded.role,
        };
      } catch (error) {
        logger.warn('Optional authentication failed', { error });
      }
    }
  }

  next();
};