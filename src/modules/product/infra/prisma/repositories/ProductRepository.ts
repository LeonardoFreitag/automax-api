import IProductRepository, {
  IListProductByPriceTableResult,
} from '@modules/product/repositories/IProductRepository';
import IListProductByPriceTableDTO from '@modules/product/dtos/IListProductByPriceTableDTO';
import { PriceTableModel } from '@models/PriceTableModel';
import { Prisma, Product, ProductPrice, ProductTissue } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class ProductRepository implements IProductRepository {
  public async findByProductCode(
    customerId: string,
    productCode: string,
  ): Promise<Product> {
    const foundProduct = await prisma.product.findFirst({
      where: {
        customerId,
        code: productCode,
      },
    });
    return foundProduct;
  }

  public async findByTablecode(
    customerId: string,
    productCode: string,
    tableCode: string,
    regionId: string,
  ): Promise<ProductPrice | undefined> {
    const foundProduct = await prisma.product.findFirst({
      where: {
        customerId,
        code: productCode,
        ProductPrice: {
          some: {
            code: tableCode,
            regionId,
          },
        },
      },
      include: {
        ProductPrice: true,
      },
    });
    const foundProductPrice = foundProduct?.ProductPrice.find(
      productPrice =>
        productPrice.code === tableCode && productPrice.regionId === regionId,
    );
    return foundProductPrice;
  }

  public async listByGroupId(
    customerId: string,
    groupId: string,
    includeInactive = false,
  ): Promise<Product[]> {
    const foundProducts = await prisma.product.findMany({
      where: {
        customerId,
        groupId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        ProductPrice: true,
      },
      orderBy: {
        description: 'asc',
      },
    });

    return foundProducts;
  }

  /**
   * Lista as tabelas de preco disponiveis para uma regiao.
   *
   * Nao existe entidade "Tabela de Preco" no schema: a tabela e o par
   * (code, tableName) desnormalizado em cada linha de ProductPrice. Por isso a
   * lista e derivada via groupBy, que ainda devolve de graca a contagem de
   * produtos de cada tabela.
   *
   * Linhas com `code` nulo sao descartadas: o code e o identificador usado
   * como chave da tabela em todo o fluxo de venda (inclusive na busca de
   * tecidos, que consulta ProductTissue.productPriceId pelo code da tabela).
   *
   * O filtro de inativos vale tambem aqui, e nao so por coerencia do
   * productCount: uma tabela cujos produtos foram todos inativados some da
   * lista, em vez de ser oferecida ao vendedor e abrir vazia.
   */
  public async listPriceTables(
    customerId: string,
    regionId: string,
    includeInactive = false,
  ): Promise<PriceTableModel[]> {
    const rows = await prisma.productPrice.groupBy({
      by: ['code', 'tableName'],
      where: {
        regionId,
        code: { not: null },
        product: {
          customerId,
          ...(includeInactive ? {} : { isActive: true }),
        },
      },
      _count: { _all: true },
      orderBy: { tableName: 'asc' },
    });

    return rows.map(row => ({
      code: row.code as string,
      tableName: row.tableName,
      // eslint-disable-next-line no-underscore-dangle
      productCount: row._count._all,
    }));
  }

  /**
   * Lista os produtos que possuem determinada tabela de preco na regiao
   * informada.
   *
   * O include devolve apenas o ProductPrice daquela tabela (o app usa
   * ProductPrice[0] direto, sem refiltrar por regiao) e o grupo do produto,
   * necessario para preencher groupName no item de venda agora que o grupo
   * deixou de ser um passo obrigatorio do fluxo.
   */
  public async listByPriceTable({
    customerId,
    tableCode,
    regionId,
    groupId,
    search,
    page,
    perPage,
    includeInactive,
  }: IListProductByPriceTableDTO): Promise<IListProductByPriceTableResult> {
    const where: Prisma.ProductWhereInput = {
      customerId,
      ...(includeInactive ? {} : { isActive: true }),
      ...(groupId ? { groupId } : {}),
      ...(search
        ? {
            OR: [
              { description: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
              { reference: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ProductPrice: { some: { code: tableCode, regionId } },
    };

    const shouldPaginate = Boolean(page && perPage);

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          ProductPrice: { where: { code: tableCode, regionId } },
          group: { select: { id: true, group: true } },
        },
        orderBy: { description: 'asc' },
        ...(shouldPaginate
          ? { skip: (page - 1) * perPage, take: perPage }
          : {}),
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  public async createManyPrice(
    productPrice: Prisma.ProductPriceUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.productPrice.createMany({
      data: productPrice,
    });
  }

  public async findPriceById(id: string): Promise<ProductPrice> {
    const foundProductPrice = await prisma.productPrice.findUnique({
      where: {
        id,
      },
    });
    return foundProductPrice;
  }

  public async createPrice(
    productPrice: Prisma.ProductPriceUncheckedCreateInput,
  ): Promise<ProductPrice> {
    const newProductPrice = await prisma.productPrice.create({
      data: productPrice,
    });

    return newProductPrice;
  }

  public async savePrice(productPrice: ProductPrice): Promise<ProductPrice> {
    const updatedProductPrice = await prisma.productPrice.update({
      where: {
        id: productPrice.id,
      },
      data: productPrice,
    });
    return updatedProductPrice;
  }

  public async deletePrice(id: string): Promise<void> {
    const foundProductPrice = await prisma.productPrice.findUnique({
      where: { id },
    });

    if (!foundProductPrice) {
      throw new AppError('Product Price not found', 404);
    }

    await prisma.productPrice.delete({
      where: {
        id,
      },
    });
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ProductPrice: true,
      },
    });

    return product;
  }

  /**
   * Produtos inativos entre os ids informados.
   *
   * Uma consulta só para o pedido inteiro: com 20 itens, verificar um a um
   * seriam 20 idas ao banco no caminho crítico do POST /sale.
   */
  public async findInactiveByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) {
      return [];
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isActive: false,
      },
    });

    return products;
  }

  public async changeActivation(
    id: string,
    isActive: boolean,
  ): Promise<Product> {
    const foundProduct = await prisma.product.findUnique({ where: { id } });

    if (!foundProduct) {
      throw new AppError('Produto não encontrado.', 404);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    return updatedProduct;
  }

  public async findByReference(
    customerId: string,
    reference: string,
  ): Promise<Product | undefined> {
    const product = await prisma.product.findFirst({
      where: { customerId, reference },
      include: {
        ProductPrice: true,
      },
    });

    return product;
  }

  public async list(
    customerId: string,
    includeInactive = false,
  ): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        customerId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        ProductPrice: true,
      },
      orderBy: {
        description: 'asc',
      },
    });

    return products;
  }

  public async create(
    productData: Prisma.ProductUncheckedCreateInput,
  ): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        ...productData,
        ProductPrice: {
          createMany: {
            data: productData.ProductPrice as Prisma.ProductPriceUncheckedCreateInput,
          },
        },
      },
    });

    return product;
  }

  public async save(product: Product): Promise<Product> {
    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        code: product.code,
        reference: product.reference,
        description: product.description,
        unity: product.unity,
        groupId: product.groupId,
      },
    });
    return updatedProduct;
  }

  public async delete(id: string): Promise<void> {
    const foundProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!foundProduct) {
      throw new AppError('Product not found', 404);
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });
  }

  public async deletePrices(productId: string): Promise<void> {
    await prisma.productPrice.deleteMany({
      where: {
        productId,
      },
    });
  }
}

export default ProductRepository;
