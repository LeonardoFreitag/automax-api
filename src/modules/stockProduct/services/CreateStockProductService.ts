import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { Prisma, StockProduct } from '@prisma/client';

@injectable()
class CreateStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  /**
   * Cria ou atualiza a matéria-prima identificada por (customerId, code).
   *
   * Antes o registro existente era apagado e recriado a cada carga. Isso
   * trocava o id — que `InventoryItems.stockProductId` e
   * `StockWithdrawalItems.stockProductId` referenciam sem FK — e, com o campo
   * `isActive` recém-criado, desfaria a inativação da retaguarda no próximo
   * envio do ERP. Atualizar preserva id e status.
   */
  public async execute({
    id,
    customerId,
    code,
    reference,
    description,
    unity,
  }: Prisma.StockProductUncheckedCreateInput): Promise<StockProduct> {
    const checkStockProductExists =
      await this.stockProductRepository.findByCode(customerId, code);

    if (checkStockProductExists) {
      return this.stockProductRepository.save({
        ...checkStockProductExists,
        reference,
        description,
        unity,
      });
    }

    const stockProduct = await this.stockProductRepository.create({
      ...(id && { id }),
      customerId,
      code,
      reference,
      description,
      unity,
    });

    return stockProduct;
  }
}

export default CreateStockProductService;
