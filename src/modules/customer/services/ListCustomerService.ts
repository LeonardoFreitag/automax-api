import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import { Customer } from '@prisma/client';

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(cnpj: string): Promise<Customer[] | undefined> {
    const allCustomers = await this.customerRepository.list(cnpj);

    return allCustomers;
  }
}

export default ListCustomerService;
