import { Registro } from '@prisma/client';

export default interface IRegistroRepository {
  findById(id: string): Promise<Registro | undefined>;
  create(id: string, validade: string): Promise<Registro>;
  save(registro: Registro): Promise<Registro>;
  showValidade(id: string): Promise<Registro | undefined>;
  list(): Promise<Registro[]>;
  delete(id: string): Promise<void>;
}
