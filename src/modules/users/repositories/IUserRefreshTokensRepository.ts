import UserRefreshToken from '@modules/users/infra/typeorm/entities/UserRefreshTokens';
import { ICreateUserRefreshToken } from '../dtos/ICreateUserRefreshTokenDTO';

export default interface IUserRefreshTokensRepository {
  generate({
    expiresDate,
    userId,
    refreshToken,
  }: ICreateUserRefreshToken): Promise<UserRefreshToken>;
  findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserRefreshToken | undefined>;
  deleteById(id: string): Promise<void>;
}
