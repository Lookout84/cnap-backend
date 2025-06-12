import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from './logger.util';
import { Environment } from '../config/environment.config';

const connection = new IORedis({
  host: Environment.REDIS_HOST,
  port: Environment.REDIS_PORT,
  password: Environment.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// Типи для черг
type QueueName = 'appointments' | 'notifications' | 'emails';

const queues: Record<QueueName, Queue> = {
  appointments: new Queue('appointments', { connection }),
  notifications: new Queue('notifications', { connection }),
  emails: new Queue('emails', { connection }),
};

// Ініціалізація воркерів
const initWorkers = () => {
  // Воркер для записів
  new Worker(
    'appointments',
    async (job) => {
      // Обробка завдання
      logger.info(`Processing appointment job ${job.id}`);
      // Тут логіка обробки
    },
    { connection }
  );

  // Воркер для сповіщень
  new Worker(
    'notifications',
    async (job) => {
      logger.info(`Processing notification job ${job.id}`);
      // Логіка відправки сповіщень
    },
    { connection }
  );

  // Воркер для email
  new Worker(
    'emails',
    async (job) => {
      logger.info(`Processing email job ${job.id}`);
      // Логіка відправки email
    },
    { connection }
  );
};

// Додавання завдань до черги
export const addToQueue = async <T>(
  queueName: QueueName,
  data: T,
  options = {}
) => {
  try {
    const queue = queues[queueName];
    await queue.add(queueName, data, options);
    logger.info(`Added job to ${queueName} queue`);
  } catch (error) {
    logger.error(`Failed to add job to ${queueName} queue`, { error });
    throw error;
  }
};

// Очищення черг
export const cleanupQueues = async () => {
  await Promise.all(
    Object.values(queues).map((queue) => queue.close())
  );
  await connection.quit();
};

// Ініціалізація при старті додатку
initWorkers();

// Обробка помилок
connection.on('error', (err) => {
  logger.error('Redis connection error', { error: err });
});