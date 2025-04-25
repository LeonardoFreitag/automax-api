import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import { Prisma, ProductTissue } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class ProductTissueRepository implements IProductTissueRepository {
  public async findTissueByCode(
    code: string,
    customerId: string,
  ): Promise<ProductTissue | undefined> {
    const foundProductTissue = await prisma.productTissue.findFirst({
      where: {
        code,
        customerId,
      },
    });
    return foundProductTissue;
  }

  public async listTissuesByProductPrice(
    customerId: string,
    productPriceId: string,
  ): Promise<ProductTissue[]> {
    const foundProductTissues = await prisma.productTissue.findMany({
      where: {
        customerId,
        productPriceId,
      },
    });
    return foundProductTissues;
  }

  public async listTissuesByCustomerId(
    customerId: string,
  ): Promise<ProductTissue[]> {
    const foundProductTissues = await prisma.productTissue.findMany({
      where: {
        customerId,
      },
    });
    return foundProductTissues;
  }

  public async deleteTissuesByProductPrice(
    productPriceId: string,
  ): Promise<void> {
    await prisma.productTissue.deleteMany({
      where: {
        productPriceId,
      },
    });
  }

  public async deleteTissuesByCustomerId(customerId: string): Promise<void> {
    await prisma.productTissue.deleteMany({
      where: {
        customerId,
      },
    });
  }

  public async createManyTissue(
    productTissue: Prisma.ProductTissueUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.productTissue.createMany({
      data: productTissue,
    });
  }

  public async findTissueById(id: string): Promise<ProductTissue> {
    const foundProductTissue = await prisma.productTissue.findUnique({
      where: {
        id,
      },
    });
    return foundProductTissue;
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
}

export default ProductTissueRepository;
