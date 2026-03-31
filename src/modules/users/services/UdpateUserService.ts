import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';
import { Prisma, User } from '@prisma/client';

interface RulesModel {
  rule: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(user: User, rules: RulesModel[]): Promise<User> {
    // Prioridade 1: busca pelo id exato enviado pelo cliente
    let foundUser = await this.userRepository.findById(user.id);

    // Prioridade 2: busca por e-mail dentro do mesmo customerId
    if (!foundUser) {
      const usersWithEmail = await this.userRepository.listByEmail(user.email);
      foundUser = usersWithEmail.find(u => u.customerId === user.customerId);
    }

    if (!foundUser) {
      try {
        const rulesList = rules.map(item => ({ rule: item.rule }));

        const hashedPassword = await this.hashProvider.generateHash(
          user.password,
        );

        const newUser = await this.userRepository.create({
          id: user.id,
          customerId: user.customerId,
          isAdmin: user.isAdmin,
          name: user.name,
          email: user.email,
          cellphone: user.cellphone,
          password: hashedPassword,
          regionId: user.regionId,
          UserRules: rulesList,
        });

        if (!newUser) {
          throw new AppError('Error creating user', 500);
        }

        return newUser;
      } catch (error) {
        console.log(error);
        throw new AppError('Error creating user', 500);
      }
    }

    const newRules: Prisma.UserRulesUncheckedCreateInput[] = rules.map(item => {
      return {
        userId: foundUser.id,
        rule: item.rule,
      };
    });

    await this.userRepository.deleteRules(foundUser.id);
    await this.userRepository.createManyRules(newRules);

    const hashedPassword = await this.hashProvider.generateHash(user.password);

    foundUser.customerId = user.customerId;
    foundUser.isAdmin = user.isAdmin;
    foundUser.name = user.name;
    foundUser.cellphone = user.cellphone;
    foundUser.email = user.email;
    foundUser.password = hashedPassword;
    foundUser.regionId = user.regionId;

    const updatedUser = await this.userRepository.save(foundUser);

    await this.userRepository.deduplicateUserByEmail(
      user.customerId,
      user.email,
    );

    return updatedUser;
  }
}

export default UpdateProfileService;
