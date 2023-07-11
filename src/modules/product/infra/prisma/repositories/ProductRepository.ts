import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Prisma, Product, ProductPrice, ProductTissue } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class ProductRepository implements IProductRepository {
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
  ): Promise<Product[]> {
    const foundProducts = await prisma.product.findMany({
      where: {
        customerId,
        groupId,
      },
      include: {
        ProductPrice: true,
      },
    });

    return foundProducts;
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
      throw new AppError('Product Price not found');
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

  public async findByReference(
    reference: string,
  ): Promise<Product | undefined> {
    const product = await prisma.product.findFirst({
      where: { reference },
      include: {
        ProductPrice: true,
      },
    });

    return product;
  }

  public async list(customerId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        customerId,
      },
      include: {
        ProductPrice: true,
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
      throw new AppError('Product not found');
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
