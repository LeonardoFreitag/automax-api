import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import { Customer } from '@prisma/client';

@injectable()
class ListAllCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(): Promise<Customer[] | undefined> {
    const allCustomers = await this.customerRepository.listAll();

    return allCustomers;
  }
}

export default ListAllCustomerService;
