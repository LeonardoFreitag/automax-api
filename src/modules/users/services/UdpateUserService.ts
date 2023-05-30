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
    const foundUser = await this.userRepository.findById(user.id);

    if (!foundUser) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(
      user.email,
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('E-mail already in use.');
    }

    const newRules: Prisma.UserRulesUncheckedCreateInput[] = rules.map(item => {
      return {
        userId: foundUser.id,
        rule: item.rule,
      };
    });

    await this.userRepository.deleteRules(user.id);
    await this.userRepository.createManyRules(newRules);

    const hashedPassword = await this.hashProvider.generateHash(user.password);

    foundUser.isAdmin = user.isAdmin;
    foundUser.name = user.name;
    foundUser.cellphone = user.cellphone;
    foundUser.email = user.email;
    foundUser.password = hashedPassword;
    foundUser.regionId = user.regionId;

    return this.userRepository.save(foundUser);
  }
}

export default UpdateProfileService;
