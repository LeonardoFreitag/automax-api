import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import { Customer, Prisma } from '@prisma/client';

import { prisma } from '@shared/infra/prisma/prisma';

class CustomerRepository implements ICustomerRepository {
  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        User: {
          include: { UserRules: true },
        },
      },
    });

    return customer;
  }

  public async findByCnpj(cnpj: string): Promise<Customer | undefined> {
    const customer = await prisma.customer.findFirst({
      where: { cnpj },
      include: {
        User: {
          include: { UserRules: true },
        },
      },
    });

    return customer;
  }

  public async list(cnpj: string): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      where: {
        cnpj,
      },
      include: {
        User: {
          include: { UserRules: true },
        },
      },
    });

    return customers;
  }

  public async create(
    CustomerData: Prisma.CustomerCreateInput,
  ): Promise<Customer> {
    const customer = await prisma.customer.create({
      data: CustomerData,
    });

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const customerUpdated = await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: customer,
    });
    return customerUpdated;
  }

  public async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}

export default CustomerRepository;
