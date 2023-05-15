import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Sale from '../infra/typeorm/entities/Sale';
import ISaleRepository from '../repositories/ISaleRepository';

interface IRequest {
  saleId: string;
  signatureFileName: string;
  signatureSize: string;
}

@injectable()
class UploadSignatureService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ saleId, signatureFileName }: IRequest): Promise<Sale> {
    const sale = await this.saleRepository.findById(saleId);

    if (!sale) {
      throw new AppError('Sale not found');
    }

    const fileName = await this.storageProvider.saveFile(signatureFileName);

    const updatedSale = await this.saleRepository.save({
      ...sale,
      signatureFileName: fileName,
      signatureUrl: `https://automax.s3.amazonaws.com/${fileName}`,
    });

    return updatedSale;
  }
}

export default UploadSignatureService;
