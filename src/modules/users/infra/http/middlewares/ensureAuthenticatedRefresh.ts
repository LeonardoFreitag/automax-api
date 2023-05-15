import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import UserRefreshTokensRepository from '../../typeorm/repositories/UserRefreshTokensRepository';

interface IPayload {
  sub: string;
  email: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  const userRefreshTokensRepository = new UserRefreshTokensRepository();

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(token, authConfig.jwt.secret_refresh) as IPayload;

    const userId = sub;

    const user = userRefreshTokensRepository.findByUserIdAndRefreshToken(
      userId,
      token,
    );

    if (!user) {
      throw new AppError('User does not exists!', 401);
    }

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
