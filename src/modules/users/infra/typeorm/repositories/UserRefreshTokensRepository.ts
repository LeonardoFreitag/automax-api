import { getRepository, Repository } from 'typeorm';

import IUserRefreshTokensRepository from '@modules/users/repositories/IUserRefreshTokensRepository';

import UserRefreshToken from '@modules/users/infra/typeorm/entities/UserRefreshTokens';
import { ICreateUserRefreshToken } from '@modules/users/dtos/ICreateUserRefreshTokenDTO';

class UserRefreshTokensRepository implements IUserRefreshTokensRepository {
  private ormRepository: Repository<UserRefreshToken>;

  constructor() {
    this.ormRepository = getRepository(UserRefreshToken);
  }

  public async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserRefreshToken | undefined> {
    const userRefreshToken = await this.ormRepository.findOne({
      where: { userId, refreshToken },
    });

    return userRefreshToken;
  }

  public async generate({
    expiresDate,
    userId,
    refreshToken,
  }: ICreateUserRefreshToken): Promise<UserRefreshToken> {
    const userRefreshToken = this.ormRepository.create({
      expiresDate,
      userId,
      refreshToken,
    });

    await this.ormRepository.save(userRefreshToken);

    return userRefreshToken;
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UserRefreshTokensRepository;
