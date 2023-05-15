import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Product from '../infra/typeorm/entities/Product';
import IProductRepository from '../repositories/IProductRepository';

interface IRequest {
  productId: string;
  photoFileName: string;
  photoSize: string;
}

@injectable()
class UploadPhotoService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    productId,
    photoFileName,
    photoSize,
  }: IRequest): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new AppError('Product not found');
    }

    const fileName = await this.storageProvider.saveFile(photoFileName);

    const updatedProduct = await this.productRepository.save({
      ...product,
      photoFileName: fileName,
      photoUrl: `https://automax.s3.amazonaws.com/${fileName}`,
      photoSize,
    });

    return updatedProduct;
  }
}

export default UploadPhotoService;
