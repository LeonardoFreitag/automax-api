import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Prisma, Product, ProductPrice, ProductTissue } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class ProductRepository implements IProductRepository {
  public async createManyPrice(
    productPrice: Prisma.ProductPriceUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.productPrice.createMany({
      data: productPrice,
    });
  }

  public async createManyTissue(
    productTissue: Prisma.ProductTissueUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.productTissue.createMany({
      data: productTissue,
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

  public async findTissueById(id: string): Promise<ProductTissue> {
    const foundProductTissue = await prisma.productTissue.findUnique({
      where: {
        id,
      },
    });
    return foundProductTissue;
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
    await prisma.productPrice.delete({
      where: {
        id,
      },
    });
  }

  public async createTissue(
    productTissue: Prisma.ProductTissueUncheckedCreateInput,
  ): Promise<ProductTissue> {
    const newTissue = await prisma.productTissue.create({
      data: productTissue,
    });

    return newTissue;
  }

  public async saveTissue(
    productTissue: ProductTissue,
  ): Promise<ProductTissue> {
    const updatedTissue = await prisma.productTissue.update({
      where: {
        id: productTissue.id,
      },
      data: productTissue,
    });

    return updatedTissue;
  }

  public async deleteTissue(id: string): Promise<void> {
    await prisma.productTissue.delete({
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
        ProductTissue: true,
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
        ProductTissue: true,
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
        ProductTissue: true,
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
        ProductTissue: {
          createMany: {
            data: productData.ProductTissue as Prisma.ProductTissueUncheckedCreateInput,
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

  public async deleteTissues(productId: string): Promise<void> {
    await prisma.productTissue.deleteMany({
      where: { productId },
    });
  }
}

export default ProductRepository;
