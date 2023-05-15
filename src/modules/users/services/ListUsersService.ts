import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

@injectable()
class ListUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(customerId: string): Promise<User[] | undefined> {
    const allUserByidCustomer = await this.userRepository.list(customerId);

    return allUserByidCustomer;
  }
}

export default ListUserService;
