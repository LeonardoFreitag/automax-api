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
  }: ICreateCustomerDTO): Promise<Customer> {
    const checkCnpjExists = await this.customerRepository.findByCnpj(cnpj);

    if (checkCnpjExists) {
      return checkCnpjExists;
    }

    const newCustomer = await this.customerRepository.create({
      cnpj,
      companyName,
    });

    const dataCustomer = this.customerRepository.findById(newCustomer.id);

    return dataCustomer;
  }
}

export default CreateCustomerService;
