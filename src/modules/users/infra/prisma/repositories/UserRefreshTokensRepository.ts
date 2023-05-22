import IUserRefreshTokensRepository from '@modules/users/repositories/IUserRefreshTokensRepository';

import { ICreateUserRefreshToken } from '@modules/users/dtos/ICreateUserRefreshTokenDTO';
import { prisma } from '@shared/infra/prisma/prisma';
import { UserRefreshTokens } from '@prisma/client';

class UserRefreshTokensRepository implements IUserRefreshTokensRepository {
  public async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserRefreshTokens | undefined> {
    const userRefreshToken = await prisma.userRefreshTokens.findFirst({
      where: {
        userId,
        refreshToken,
      },
    });

    return userRefreshToken;
  }

  public async generate({
    expiresDate,
    userId,
    refreshToken,
  }: ICreateUserRefreshToken): Promise<UserRefreshTokens> {
    const userRefreshToken = await prisma.userRefreshTokens.create({
      data: {
        expiresDate,
        userId,
        refreshToken,
      },
    });

    return userRefreshToken;
  }

  public async deleteById(id: string): Promise<void> {
    await prisma.userRefreshTokens.delete({
      where: {
        id,
      },
    });
  }
}

export default UserRefreshTokensRepository;
