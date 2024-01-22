import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';
import { Prisma, User } from '@prisma/client';

interface RulesModel {
  rule: string;
}

@injectable()
class UpdateEmailUserAdminService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(
    customerId: string,
    old_email: string,
    new_email: string,
  ): Promise<User> {
    const foundUser = await this.userRepository.findByEmail(old_email);

    if (!foundUser) {
      throw new AppError('User not found', 404);
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(
      new_email,
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== foundUser.id) {
      throw new AppError('E-mail already in use.', 409);
    }

    const updateduser = await this.userRepository.updateEmailUserAdmin(
      customerId,
      old_email,
      new_email,
    );

    return updateduser;
  }
}

export default UpdateEmailUserAdminService;
