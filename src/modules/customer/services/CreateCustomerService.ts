import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import { Customer, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute({
    cnpj,
    companyName,
  }: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    const checkCustomerExists = await this.customerRepository.findByCnpj(cnpj);

    if (checkCustomerExists) {
      throw new AppError('Customer already exists!');
    }

    const customer = await this.customerRepository.create({
      cnpj,
      companyName,
    });

    return customer;
  }
}

export default CreateCustomerService;
