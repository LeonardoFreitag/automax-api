import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import { User } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

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
    regionId,
    UserRules,
  }: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError(
        'Já existe um usuário regitrado com este e-mail.',
        409,
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const newUser = await this.userRepository.create({
      customerId,
      isAdmin,
      name,
      email,
      cellphone,
      password: hashedPassword,
      regionId,
      UserRules,
    });

    return newUser;
  }
}

export default CreateUserService;
