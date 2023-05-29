import { Prisma, User, UserRules } from '@prisma/client';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  save(user: User): Promise<User>;
  list(customerId: string): Promise<User[]>;
  delete(id: string): Promise<void>;
  createRule(userId: string, rule: string): Promise<UserRules | undefined>;
  createManyRules(rules: Prisma.UserRulesUncheckedCreateInput[]): Promise<void>;
  deleteRule(id: string): Promise<void>;
  deleteRules(userId: string): Promise<void>;
  saveRule(rule: UserRules): Promise<UserRules>;
}
