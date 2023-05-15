import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: IUpdateUserDTO): Promise<User> {
    const { id, email } = data;
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
      throw new AppError('E-mail already in use.');
    }

    this.userRepository.deleteRules(data.id);

    user.isAdmin = data.isAdmin;
    user.name = data.name;
    user.cellphone = data.cellphone;
    user.email = data.email;
    user.isCommissioned = data.isCommissioned;
    user.comissionPercentage = data.comissionPercentage;

    // if (password && !oldPassword) {
    //   throw new AppError(
    //     'You need to informe de old password to set a new password.',
    //   );
    // }

    // if (password && oldPassword) {
    //   const checkOldPassword = await this.hashProvider.compareHash(
    //     oldPassword,
    //     user.password,
    //   );

    //   if (!checkOldPassword) {
    //     throw new AppError('Old password does not match.');
    //   }
    //   user.password = await this.hashProvider.generateHash(password);
    // }

    return this.userRepository.save(user);
  }
}

export default UpdateProfileService;
