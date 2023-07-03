import { Customer, Prisma } from '@prisma/client';

export default interface ICustomerRepository {
  findById(id: string): Promise<Customer | undefined>;
  findByCnpj(cnpj: string): Promise<Customer | undefined>;
  create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer>;
  save(ustomer: Customer): Promise<Customer>;
  list(cnpj: string): Promise<Customer[]>;
  listAll(): Promise<Customer[]>;
  delete(id: string): Promise<void>;
}
