import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    customerId,
    isAdmin,
    name,
    email,
    cellphone,
    password,
    comissionPercentage,
    isCommissioned,
    rules,
  }: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      this.userRepository.delete(checkUserExists.id);
      // throw new AppError(
      //   'Já existe um usuário regitrado com este e-mail.',
      //   409,
      // );
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      customerId,
      isAdmin,
      name,
      email,
      cellphone,
      password: hashedPassword,
      comissionPercentage,
      isCommissioned,
      rules,
    });

    return user;
  }
}

export default CreateUserService;
