import winston from 'winston';
import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Environment } from '../config/environment.config';

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
});

const fileTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    format.json()
  ),
});

export const logger = winston.createLogger({
  level: Environment.NODE_ENV === 'development' ? 'debug' : 'info',
  transports: [consoleTransport],
});

if (Environment.NODE_ENV === 'production') {
  logger.add(fileTransport);
}

// Допоміжні функції для структурованого логування
export const logError = (error: unknown, context?: Record<string, unknown>) => {
  if (error instanceof Error) {
    logger.error({
      message: error.message,
      stack: error.stack,
      ...context,
    });
  } else {
    logger.error({
      message: 'Unknown error occurred',
      error,
      ...context,
    });
  }
};

export const logRequest = (req: {
  method: string;
  url: string;
  params?: unknown;
  body?: unknown;
}) => {
  logger.info({
    message: 'Request received',
    method: req.method,
    url: req.url,
    params: req.params,
    body: req.body,
  });
};

export const logResponse = (res: {
  statusCode: number;
  responseTime: number;
}) => {
  logger.info({
    message: 'Response sent',
    status: res.statusCode,
    responseTime: `${res.responseTime}ms`,
  });
};