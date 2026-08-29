import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { Client } from '@prisma/client';

/**
 * Procura cliente já cadastrado pelo documento, dentro do customer.
 *
 * Usado pelo `POST /client` para decidir entre criar e atualizar. Documento
 * vazio devolve undefined — em branco não identifica ninguém, e tratá-lo como
 * chave era o que fazia a carga apagar o cadastro errado.
 */
@injectable()
class FindClientByCnpjService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(
    customerId: string,
    cnpj: string,
  ): Promise<Client | undefined> {
    return this.clientRepository.findByCnpj(customerId, cnpj);
  }
}

export default FindClientByCnpjService;
