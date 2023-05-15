import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import UserRules from '../entities/UserRules';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  private ormRulesRepository: Repository<UserRules>;

  constructor() {
    this.ormRepository = getRepository(User);
    this.ormRulesRepository = getRepository(UserRules);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { id },
    });

    return user;
  }

  public async list(customerId: string): Promise<User[]> {
    const users = this.ormRepository.find({
      where: {
        customerId,
      },
    });

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async create(userData: ICreateUsersDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteRules(userId: string): Promise<void> {
    await this.ormRulesRepository.delete({ userId });
  }
}

export default UsersRepository;
