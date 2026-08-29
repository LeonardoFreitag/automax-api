import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import { Prisma, Product } from '@prisma/client';
import assertProductGroup from './assertProductGroup';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('GroupRepository')
    private groupRepository: IGroupRepository,
  ) {}

  /**
   * Cria ou atualiza o produto identificado por (customerId, code).
   *
   * Até aqui, reenviar um produto existente **apagava e recriava** o registro.
   * Três consequências, todas silenciosas:
   *
   * - o id trocava a cada carga, e o id é o que o ERP guarda como API_KEY —
   *   além de deixar `SaleItems.productId` e `BudgetItems.productId` apontando
   *   para um uuid morto;
   * - foto do produto (`photoFileName`, `photoUrl`, `photoSize`) era perdida,
   *   porque o registro novo nasce sem ela;
   * - e, agora que existe `isActive`, a carga zeraria a inativação feita pela
   *   retaguarda. Uma garantia de status que a própria sincronização desfaz não
   *   é garantia nenhuma.
   *
   * `save()` atualiza apenas os campos vindos do ERP, então foto e `isActive`
   * sobrevivem à carga. Inativar e reativar continuam sendo exclusividade do
   * `PATCH /product/status`.
   */
  public async execute({
    id,
    customerId,
    code,
    reference,
    description,
    unity,
    groupId,
    ProductPrice,
  }: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const group = groupId
      ? await this.groupRepository.findById(groupId)
      : undefined;

    assertProductGroup(group, groupId, customerId, code);

    // O tipo aninhado do Prisma é o que o repositório espera montar; o que
    // chega do ERP é o array cru.
    const priceList = Array.isArray(ProductPrice)
      ? (ProductPrice as Prisma.ProductPriceUncheckedCreateInput[])
      : [];

    const checkProductExists = await this.productRepository.findByProductCode(
      customerId,
      code,
    );

    if (checkProductExists) {
      // Preços são substituídos por completo — é a semântica que o ERP já
      // esperava do delete-e-recria, e a que o PATCH /product usa.
      await this.productRepository.deletePrices(checkProductExists.id);

      if (priceList.length > 0) {
        await this.productRepository.createManyPrice(
          priceList.map(price => ({
            ...price,
            productId: checkProductExists.id,
          })),
        );
      }

      return this.productRepository.save({
        ...checkProductExists,
        reference,
        description,
        unity,
        groupId,
      });
    }

    const product = await this.productRepository.create({
      ...(id && { id }),
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      ProductPrice,
    });

    return product;
  }
}

export default CreateProductService;
