import AppError from '@shared/errors/AppError';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { injectable, inject } from 'tsyringe';
import { ClientContact } from '@prisma/client';

@injectable()
class UpdateClientContactService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(data: ClientContact): Promise<ClientContact> {
    const { id } = data;
    const contact = await this.clientRepository.findContactById(id);

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    contact.name = data.name;
    contact.fone = data.fone;
    contact.foneType = data.foneType;
    contact.isWhatsApp = data.isWhatsApp;
    contact.email = data.email;
    contact.job = data.job;

    return this.clientRepository.saveContact(contact);
  }
}

export default UpdateClientContactService;
