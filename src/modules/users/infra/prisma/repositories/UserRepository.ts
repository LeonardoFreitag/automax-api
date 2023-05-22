import IUserRepository from '@modules/users/repositories/IUserRepository';
import { Prisma, User, UserRules } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class UserRepository implements IUserRepository {
  public async createRule(userId: string, rule: string): Promise<UserRules> {
    const newRule = await prisma.userRules.create({
      data: {
        userId,
        rule,
      },
    });
    return newRule;
  }

  public async deleteRule(id: string): Promise<void> {
    await prisma.userRules.delete({
      where: { id },
    });
  }

  public async saveRule(rule: UserRules): Promise<UserRules> {
    const updatedRule = await prisma.userRules.update({
      where: {
        id: rule.id,
      },
      data: rule,
    });
    return updatedRule;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  public async list(customerId: string): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        customerId,
      },
      include: { UserRules: true },
    });

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    return user;
  }

  public async create(
    userData: Prisma.UserCreateInput,
  ): Promise<User | undefined> {
    const newUser = await prisma.user.create({
      data: {
        customerId: userData.customerId,
        isAdmin: userData.isAdmin,
        name: userData.name,
        cellphone: userData.cellphone,
        email: userData.email,
        password: userData.password,
        isComissioned: userData.isComissioned,
        perCommission: new Prisma.Decimal(userData.perCommission.toString()),
        UserRules: {
          createMany: {
            data: userData.UserRules as Prisma.UserRulesUncheckedCreateInput,
          },
        },
      },
    });

    return newUser;
  }

  public async save(user: User): Promise<User> {
    const userUpdated = await prisma.user.update({
      where: { id: user.id },
      data: user,
    });
    return userUpdated;
  }

  public async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export default UserRepository;
