import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import slowDown from 'express-slow-down';
import 'express-async-errors';

import '../database';
import { router } from './routes';
import AppError from '../errors/AppError';

const isProd = process.env.NODE_ENV === 'production';

const app = express();

const speedLimiter = slowDown({
  windowMs: 1000 * 60 * 10, // 10 minutes
  delayAfter: 10000,
  delayMs: 100,
});

app.use(cors());
app.use(helmet());
app.use(speedLimiter);
app.use(morgan(isProd ? 'tiny' : 'dev'));
app.use(express.json());
app.use('/v1', router);

app.use((error: Error, request: Request, response: Response, _: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error.',
  });
});

app.listen(3333);
