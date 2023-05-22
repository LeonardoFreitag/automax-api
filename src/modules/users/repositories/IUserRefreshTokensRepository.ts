import { UserRefreshTokens } from '@prisma/client';
import { ICreateUserRefreshToken } from '../dtos/ICreateUserRefreshTokenDTO';

export default interface IUserRefreshTokensRepository {
  generate({
    expiresDate,
    userId,
    refreshToken,
  }: ICreateUserRefreshToken): Promise<UserRefreshTokens>;
  findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserRefreshTokens | undefined>;
  deleteById(id: string): Promise<void>;
}
