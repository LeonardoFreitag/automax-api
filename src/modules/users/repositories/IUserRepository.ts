import { Prisma, User, UserRules } from '@prisma/client';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  save(user: User): Promise<User>;
  list(customerId: string): Promise<User[]>;
  delete(id: string): Promise<void>;
  createRule(userId: string, rule: string): Promise<UserRules | undefined>;
  deleteRule(id: string): Promise<void>;
  saveRule(rule: UserRules): Promise<UserRules>;
}
