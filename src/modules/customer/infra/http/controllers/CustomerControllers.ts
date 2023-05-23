import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/customer/services/CreateCustomerService';
import UpdateCustomerService from '@modules/customer/services/UdpateCustomerService';
import ListCustomerService from '@modules/customer/services/ListCustomerService';
import DeleteCustomerService from '@modules/customer/services/DeleteCustomerService';

export default class CustomerControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { cnpj, companyName } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      cnpj,
      companyName,
    });

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateCustomer = container.resolve(UpdateCustomerService);

    const customer = await updateCustomer.execute(data);

    return response.json(customer);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { cnpj } = request.query;

    const listCustomers = container.resolve(ListCustomerService);

    const customers = await listCustomers.execute(String(cnpj));

    return response.json(customers);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteCustomerService = container.resolve(DeleteCustomerService);

    await deleteCustomerService.execute(String(id));

    return response.status(204).json();
  }
}
