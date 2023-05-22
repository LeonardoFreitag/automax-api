import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { UserTokens } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class UserTokensRepository implements IUserTokensRepository {
  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = await prisma.userTokens.findUnique({
      where: { token },
    });

    return userToken;
  }

  public async generate(id: string): Promise<UserTokens> {
    const userToken = await prisma.userTokens.create({
      data: {
        userId: id,
      },
    });

    return userToken;
  }
}

export default UserTokensRepository;
