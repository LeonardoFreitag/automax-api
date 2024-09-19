import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import AppError from '@shared/errors/AppError';
// import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import uploadConfig from '@config/upload';
import swaggerFile from '../../../swagger.json';
import routes from './routes';

// import '@shared/infra/typeorm';
import '@shared/infra/prisma/prisma';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'erro',
      message: err.message,
      tokenExpired: err.tokenExpired,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(process.env.APP_API_URL, () => {
  console.log(`✈ Server started on port ${process.env.APP_API_URL}!`);
});
