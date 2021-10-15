import 'dotenv/config';
import Redis from 'ioredis';

export const cache = new Redis({
  host: 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});
