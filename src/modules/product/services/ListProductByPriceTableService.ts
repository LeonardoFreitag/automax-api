import { injectable, inject } from 'tsyringe';
import IProductRepository, {
  IListProductByPriceTableResult,
} from '@modules/product/repositories/IProductRepository';
import IListProductByPriceTableDTO from '@modules/product/dtos/IListProductByPriceTableDTO';

@injectable()
class ListProductByPriceTableService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    data: IListProductByPriceTableDTO,
  ): Promise<IListProductByPriceTableResult> {
    const result = await this.productRepository.listByPriceTable(data);

    return result;
  }
}

export default ListProductByPriceTableService;
