import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { ClientContact, Prisma } from '@prisma/client';

@injectable()
class CreateClientContactService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute({
    name,
    fone,
    foneType,
    isWhatsApp,
    email,
    job,
    clientId,
  }: Prisma.ClientContactUncheckedCreateInput): Promise<ClientContact> {
    const clientContact = await this.clientRepository.createContact({
      name,
      fone,
      foneType,
      isWhatsApp,
      email,
      job,
      clientId,
    });

    return clientContact;
  }
}

export default CreateClientContactService;
