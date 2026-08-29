import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { StockProduct } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class FindStockProductByReferenceService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  // o QR code do produto é gerado a partir do campo "reference"
  public async execute(
    customerId: string,
    reference: string,
  ): Promise<StockProduct> {
    const stockProduct = await this.stockProductRepository.findByReference(
      customerId,
      reference,
    );

    // Mensagem em português porque o app passou a exibi-la direto na leitura de
    // QR, em vez de trocar por um texto genérico.
    if (!stockProduct) {
      throw new AppError('Matéria-prima não localizada neste cadastro.', 404);
    }

    // A busca não filtra inativo no repositório de propósito: se filtrasse, ler
    // o QR de um item inativado devolveria "não encontrado" e o almoxarife
    // procuraria um problema de etiqueta que não existe. Aqui o motivo real
    // aparece.
    if (stockProduct.isActive === false) {
      throw new AppError(
        `${stockProduct.code} - ${stockProduct.description} foi inativado pela retaguarda e não pode ser movimentado.`,
        409,
      );
    }

    return stockProduct;
  }
}

export default FindStockProductByReferenceService;
