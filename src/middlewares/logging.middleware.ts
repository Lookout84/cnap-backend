import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    logger.info({
      message: 'Request completed',
      method,
      url: originalUrl,
      status: statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  });

  logger.info({
    message: 'Request received',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next();
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    message: 'Error occurred',
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  next(err);
};