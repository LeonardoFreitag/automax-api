import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import AppError from '@shared/errors/AppError';
import { StockProduct } from '@prisma/client';

/**
 * Ativa ou desativa um item de matéria-prima.
 *
 * Mesma semântica do `PATCH /product/status`: some das telas de escolha
 * (`GET /stockProduct` e `/stockProduct/search`) e a leitura de QR passa a
 * recusar o item, sem apagar nada. Inventários e baixas antigos continuam
 * legíveis — `InventoryItems` e `StockWithdrawalItems` guardam código,
 * referência, descrição e unidade desnormalizados.
 */
@injectable()
class ChangeStatusStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  public async execute(
    id: string,
    customerId: string,
    isActive: boolean,
  ): Promise<StockProduct> {
    const stockProduct = await this.stockProductRepository.findById(id);

    if (!stockProduct) {
      throw new AppError('Matéria-prima não encontrada.', 404);
    }

    if (stockProduct.customerId !== customerId) {
      throw new AppError(
        `Matéria-prima ${id} pertence a outro customer. Nada foi alterado.`,
        409,
      );
    }

    const updatedStockProduct =
      await this.stockProductRepository.changeActivation(id, isActive);

    return updatedStockProduct;
  }
}

export default ChangeStatusStockProductService;
