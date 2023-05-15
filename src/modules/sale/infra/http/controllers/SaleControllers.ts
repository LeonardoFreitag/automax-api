import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateSaleService from '@modules/sale/services/CreateSaleService';
import UpdateSaleService from '@modules/sale/services/UdpateSaleService';
import ListSaleService from '@modules/sale/services/ListSaleService';
import DeleteSaleService from '@modules/sale/services/DeleteSaleService';
import UploadSignatureService from '@modules/sale/services/UploadSignatureService';

export default class SaleControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      selerId,
      saleNumber,
      saleDate,
      clientId,
      items,
      amount,
      discount,
      total,
      notes,
      finished,
      sent,
      refused,
      refusedNotes,
      returned,
      returnedNotes,
      paymentForm,
      signatureBase64,
    } = request.body;

    const createSale = container.resolve(CreateSaleService);

    const Sale = await createSale.execute({
      customerId,
      selerId,
      saleNumber,
      saleDate,
      clientId,
      items,
      amount,
      discount,
      total,
      notes,
      finished,
      sent,
      refused,
      refusedNotes,
      returned,
      returnedNotes,
      paymentForm,
      signatureBase64,
    });

    return response.json(classToClass(Sale));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateSale = container.resolve(UpdateSaleService);

    const Sale = await updateSale.execute(data);

    return response.json(classToClass(Sale));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listSales = container.resolve(ListSaleService);

    const Sale = await listSales.execute(String(customerId));

    return response.json(classToClass(Sale));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteSaleService = container.resolve(DeleteSaleService);

    await deleteSaleService.execute(String(id));

    return response.status(204).json();
  }

  public async uploadSignature(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { saleId, size } = request.query;
    const uploadSignatureService = container.resolve(UploadSignatureService);
    const id = String(saleId);
    const sz = String(size);
    const entrieAttach = await uploadSignatureService.execute({
      saleId: id,
      signatureSize: sz,
      signatureFileName: request.file.filename,
    });

    return response.json(classToClass(entrieAttach));
  }
}
