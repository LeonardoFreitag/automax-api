import AppError from '@shared/errors/AppError';
import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import { injectable, inject } from 'tsyringe';
import { Customer } from '@prisma/client';

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(data: Customer): Promise<Customer> {
    const { id } = data;
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    customer.cnpj = data.cnpj;
    customer.companyName = data.companyName;

    return this.customerRepository.save(customer);
  }
}

export default UpdateCustomerService;
