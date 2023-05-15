import { sign, verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { addDays } from 'date-fns';
import IUserRefreshTokensRepository from '../repositories/IUserRefreshTokensRepository';

interface IPayload {
  sub: string;
  email: string;
}

interface IResponse {
  // user: User;
  token: string;
  refreshToken: string;
}

@injectable()
class RefreshTokenService {
  constructor(
    @inject('UserRefreshTokensRepository')
    private userRefreshTokensRepository: IUserRefreshTokensRepository,
  ) {}

  async execute(refreshToken: string): Promise<IResponse> {
    const {
      secret,
      expiresIn,
      secret_refresh,
      expiresInRefresh,
      expiresInRefreshDays,
    } = authConfig.jwt;

    const { sub, email } = verify(refreshToken, secret_refresh) as IPayload;

    const userId = sub;

    // console.log('REFRESHTOKEN RECEBIDO', refreshToken);

    const userToken =
      await this.userRefreshTokensRepository.findByUserIdAndRefreshToken(
        userId,
        refreshToken,
      );
    // console.log('RESULTADO DA BUSCA', userToken);

    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }

    const newToken = sign({}, secret, {
      subject: userId,
      expiresIn,
    });

    const newRefreshToken = sign({ email }, secret_refresh, {
      subject: userId,
      expiresIn: expiresInRefresh,
    });

    const newExpiresDate = addDays(new Date(), expiresInRefreshDays);

    await this.userRefreshTokensRepository.generate({
      userId,
      expiresDate: newExpiresDate,
      refreshToken: newRefreshToken,
    });

    await this.userRefreshTokensRepository.deleteById(userToken.id);

    const newData: IResponse = {
      refreshToken: newRefreshToken,
      token: newToken,
    };

    return newData;
  }
}

export default RefreshTokenService;
