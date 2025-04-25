import { ClientTemp } from '@prisma/client';
import { ICreateClientTempDTO } from '../dtos/ICreateClientTempDTOS';

export default interface IClientRepository {
  create(data: ICreateClientTempDTO): Promise<ClientTemp>;
  findByCnpj(cnpj: string): Promise<ClientTemp | undefined>;
  findById(id: string): Promise<ClientTemp | undefined>;
  findByCustomerId(customerId: string): Promise<ClientTemp[]>;
  update(cliente: ClientTemp): Promise<ClientTemp>;
  delete(id: string): Promise<void>;
  listNewClientsTemp(customerId: string): Promise<ClientTemp[]>;
  changeDownloaded(id: string, downloaded: boolean): Promise<ClientTemp>;
}
