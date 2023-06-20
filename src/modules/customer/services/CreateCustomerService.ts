import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import { Customer, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface ICreateCustomerDTO extends Prisma.CustomerUncheckedCreateInput {
  cellphone: string;
  email: string;
  password: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    cnpj,
    companyName,
    cellphone,
    email,
    password,
  }: ICreateCustomerDTO): Promise<Customer> {
    const hashedPassword = await this.hashProvider.generateHash(password);

    const checkUserExists = await this.userRepository.findByEmail(email);

    const checkCustomerExists = await this.customerRepository.findByCnpj(cnpj);

    if (checkCustomerExists || checkUserExists) {
      throw new AppError('Customer already exists!');
    }

    const customer = await this.customerRepository.create({
      cnpj,
      companyName,
    });

    const newUser = await this.userRepository.create({
      customerId: customer.id,
      isAdmin: true,
      name: customer.companyName,
      email,
      cellphone,
      password: hashedPassword,
      UserRules:
        [] as Prisma.UserRulesUncheckedCreateNestedManyWithoutUserInput,
    });

    await this.userRepository.createRule(newUser.id, 'admin');

    const dataCustomer = this.customerRepository.findById(customer.id);

    return dataCustomer;
  }
}

export default CreateCustomerService;
