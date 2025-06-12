import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger.util';
import { Environment } from '../config/environment.config';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Налаштування зберігання
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    cb(null, Environment.UPLOAD_DIR);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Фільтр файлів
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Ініціалізація multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Функція для видалення файлу
export const deleteFile = (filePath: string): Promise<void> => {
  const fs = require('fs').promises;
  return fs.unlink(filePath).catch((err: Error) => {
    logger.error(`Failed to delete file ${filePath}`, { error: err });
    throw err;
  });
};

// Генерація URL для файлу
export const generateFileUrl = (filename: string) => {
  return `${Environment.BASE_URL}/uploads/${filename}`;
};

// Валідація розміру файлу
export const validateFileSize = (file: Express.Multer.File, maxSizeMB: number)