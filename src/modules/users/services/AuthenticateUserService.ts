import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';

import { addDays } from 'date-fns';
import { User } from '@prisma/client';
import IUserRefreshTokensRepository from '../repositories/IUserRefreshTokensRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@injectable()
class AuthenticateUserServide {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserRefreshTokensRepository')
    private userRefreshTokensRepository: IUserRefreshTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // user.password = senha criptografada
    // password do request é a senha não criptografada

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const {
      secret,
      expiresIn,
      secret_refresh,
      expiresInRefresh,
      expiresInRefreshDays,
    } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const refreshToken = sign({ email }, secret_refresh, {
      subject: user.id,
      expiresIn: expiresInRefresh,
    });

    const newExpiresDate = addDays(new Date(), expiresInRefreshDays);

    await this.userRefreshTokensRepository.generate({
      userId: user.id,
      expiresDate: newExpiresDate,
      refreshToken,
    });

    return {
      user,
      token,
      refreshToken,
    };
  }
}

export default AuthenticateUserServide;
