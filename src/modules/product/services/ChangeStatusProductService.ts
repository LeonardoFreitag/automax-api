import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import AppError from '@shared/errors/AppError';
import { Product } from '@prisma/client';

/**
 * Ativa ou desativa um produto de venda.
 *
 * Inativar tira o produto das telas de escolha (GET /product,
 * /product/group, /product/priceTables e /product/priceTable) e faz
 * POST /sale e POST /budget recusarem o lançamento — sem apagar nada. Pedidos e
 * orçamentos antigos continuam legíveis: SaleItems e BudgetItems guardam
 * código, descrição, preço, grupo e tecido desnormalizados.
 *
 * Reativar devolve tudo ao normal e preserva o id do produto, que é o que o ERP
 * guarda como API_KEY.
 */
@injectable()
class ChangeStatusProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    id: string,
    customerId: string,
    isActive: boolean,
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    // O id sozinho já seria suficiente para o update. A conferência existe
    // porque o customerId vem no corpo e um id trocado entre bases inativaria
    // o produto de outro cliente sem nenhum sinal.
    if (product.customerId !== customerId) {
      throw new AppError(
        `Produto ${id} pertence a outro customer. Nada foi alterado.`,
        409,
      );
    }

    const updatedProduct = await this.productRepository.changeActivation(
      id,
      isActive,
    );

    return updatedProduct;
  }
}

export default ChangeStatusProductService;
