import { UserTokens } from '@prisma/client';

export default interface IUserTokensRepository {
  generate(id: string): Promise<UserTokens>;
  findByToken(token: string): Promise<UserTokens | undefined>;
}
