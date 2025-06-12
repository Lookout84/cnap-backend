import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.util';
import { Environment } from '../config/environment.config';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse } from '../utils/apiResponse.util';

const getKey = (req: Request) => {
  return req.ip || req.headers['x-forwarded-for'] || 'unknown_ip';
};

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: Environment.RATE_LIMIT_MAX, // Ліміт запитів
  keyGenerator: getKey,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: getKey(req) });
    sendErrorResponse(
      res,
      'Too many requests, please try again later',
      StatusCodes.TOO_MANY_REQUESTS
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 10, // Ліміт спроб входу
  keyGenerator: (req) => {
    return `${getKey(req)}_${req.body.email || 'unknown'}`;
  },
  skipSuccessfulRequests: true, // Не враховувати успішні запити
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', { ip: getKey(req) });
    sendErrorResponse(
      res,
      'Too many login attempts, please try again later',
      StatusCodes.TOO_MANY_REQUESTS
    );
  },
});

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== Environment.API_KEY) {
    logger.warn('Invalid API key attempt', { ip: getKey(req) });
    return sendErrorResponse(
      res,
      'Invalid or missing API key',
      StatusCodes.UNAUTHORIZED
    );
  }

  next();
};