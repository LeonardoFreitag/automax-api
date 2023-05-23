import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }
}

export default DeleteCustomerService;
