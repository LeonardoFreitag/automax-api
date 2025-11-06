import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import { User } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { ICreateUserRuleDTO } from '../dtos/ICreateUserRuleDTO';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    customerId,
    isAdmin,
    name,
    email,
    cellphone,
    password,
    regionId,
    UserRules,
  }: ICreateUserDTO): Promise<User> {
    if (id) {
      const existingUser = await this.userRepository.findById(id);

      if (existingUser) {
        await this.userRepository.deleteRules(existingUser.id);

        // faz o update caso o usuario ja exista
        const rulesList = UserRules.map(item => {
          return {
            rule: item.rule,
          };
        });

        const hashedPassword = await this.hashProvider.generateHash(password);

        const newUser = await this.userRepository.save({
          ...existingUser,
          customerId,
          isAdmin,
          name,
          email,
          cellphone,
          password: hashedPassword,
          regionId,
        });

        await this.userRepository.createManyRules(
          rulesList.map(rule => ({
            userId: newUser.id,
            rule: rule.rule,
          })),
        );

        const updatedUser = await this.userRepository.findById(newUser.id);

        return updatedUser as User;
      }
    }

    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      // deleta rulas antigas
      await this.userRepository.deleteRules(checkUserExists.id);

      // faz o update caso o usuario ja exista
      const rulesList = UserRules.map(item => {
        return {
          userId: checkUserExists.id,
          rule: item.rule,
        };
      });

      const hashedPassword = await this.hashProvider.generateHash(password);

      const newUser = await this.userRepository.save({
        ...checkUserExists,
        customerId,
        isAdmin,
        name,
        email,
        cellphone,
        password: hashedPassword,
        regionId,
      });

      await this.userRepository.createManyRules(rulesList);

      const updatedUser = await this.userRepository.findById(newUser.id);

      return updatedUser as User;
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
