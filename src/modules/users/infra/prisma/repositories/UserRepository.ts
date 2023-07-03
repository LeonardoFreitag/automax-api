import IUserRepository from '@modules/users/repositories/IUserRepository';
import { Prisma, User, UserRules } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class UserRepository implements IUserRepository {
  public async updateEmailUserAdmin(
    customerId: string,
    old_email: string,
    new_email: string,
  ): Promise<User> {
    const userForUpdate = await prisma.user.findFirst({
      where: {
        email: old_email,
        customerId,
      },
    });

    if (userForUpdate) {
      await prisma.user.update({
        where: { id: userForUpdate.id },
        data: {
          email: new_email,
        },
      });
    }

    const updatedUser = await prisma.user.findFirst({
      where: {
        email: new_email,
        customerId,
      },
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  public async listByRule(customerId: string, rule: string): Promise<User[]> {
    const listUsers = await prisma.user.findMany({
      where: {
        customerId,
        UserRules: {
          some: {
            rule,
          },
        },
      },
      include: { UserRules: true },
    });
    return listUsers;
  }

  public async createManyRules(
    rules: Prisma.UserRulesUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.userRules.createMany({
      data: rules,
    });
  }

  public async deleteRules(userId: string): Promise<void> {
    await prisma.userRules.deleteMany({
      where: { userId },
    });
  }

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
      include: { UserRules: true },
    });

    return user;
  }

  public async create(
    userData: Prisma.UserUncheckedCreateInput,
  ): Promise<User | undefined> {
    const newUser = await prisma.user.create({
      data: {
        customerId: userData.customerId,
        isAdmin: userData.isAdmin,
        name: userData.name,
        cellphone: userData.cellphone,
        email: userData.email,
        password: userData.password,
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
