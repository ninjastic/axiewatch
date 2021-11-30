import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';

import '../database';
import { router } from './routes';
import AppError from '../errors/AppError';

const isProd = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan(isProd ? 'tiny' : 'dev'));
app.use(express.json({ limit: '50mb' }));
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

app.listen(Number(process.env.API_PORT || 3333));
