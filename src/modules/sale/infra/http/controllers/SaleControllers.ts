import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSaleService from '@modules/sale/services/CreateSaleService';
import CreateSaleItemService from '@modules/sale/services/CreateSaleItemService';
import CreateSalePaymentFormService from '@modules/sale/services/CreateSalePaymentFormService';
import UpdateSaleService from '@modules/sale/services/UdpateSaleService';
import UpdateSaleStatusService from '@modules/sale/services/UdpateSaleStatusService';
import UpdateSaleItemService from '@modules/sale/services/UdpateSaleItemService';
import UpdateSalePaymentFormService from '@modules/sale/services/UdpateSalePaymentFormService';
import ListSaleService from '@modules/sale/services/ListSaleService';
import DeleteSaleService from '@modules/sale/services/DeleteSaleService';
import DeleteSaleItemService from '@modules/sale/services/DeleteSaleItemService';
import DeleteSalePaymentFormService from '@modules/sale/services/DeleteSalePaymentFormService';
import UploadSignatureService from '@modules/sale/services/UploadSignatureService';

export default class SaleControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      sellerId,
      saleNumber,
      saleDate,
      clientId,
      amount,
      discount,
      increment,
      total,
      notes,
      saleStatus,
      refusedNotes,
      returnedNotes,
      signatureBase64,
      SaleItems,
      SalePaymentForm,
    } = request.body;

    const createSale = container.resolve(CreateSaleService);

    const sale = await createSale.execute({
      customerId,
      sellerId,
      saleNumber,
      saleDate,
      clientId,
      amount,
      discount,
      increment,
      total,
      notes,
      saleStatus,
      refusedNotes,
      returnedNotes,
      signatureBase64,
      SaleItems,
      SalePaymentForm,
    });

    return response.json(sale);
  }

  public async createItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      saleId,
      productId,
      code,
      reference,
      description,
      unity,
      tableId,
      tableName,
      price,
      quantity,
      amount,
      notes,
      originalPrice,
      groupId,
      groupName,
      tissueId,
      tissueCode,
      tissueName,
      underMeasure,
      widthSale,
    } = request.body;

    const createSaleItem = container.resolve(CreateSaleItemService);

    const saleItem = await createSaleItem.execute({
      saleId,
      productId,
      code,
      reference,
      description,
      unity,
      tableId,
      tableName,
      price,
      quantity,
      amount,
      notes,
      originalPrice,
      groupId,
      groupName,
      tissueId,
      tissueCode,
      tissueName,
      underMeasure,
      widthSale,
    });

    return response.json(saleItem);
  }

  public async createPaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { saleId, paymentFormId, description, amount, installments } =
      request.body;

    const createSalePamentForm = container.resolve(
      CreateSalePaymentFormService,
    );

    const salePaymentForm = await createSalePamentForm.execute({
      saleId,
      paymentFormId,
      description,
      amount,
      installments,
    });

    return response.json(salePaymentForm);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateSaleStatus = container.resolve(UpdateSaleStatusService);

    const sale = await updateSaleStatus.execute(data);

    return response.json(sale);
  }

  public async updateStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateSaleStatus = container.resolve(UpdateSaleService);

    const sale = await updateSaleStatus.execute(data);

    return response.json(sale);
  }

  public async updateItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateSaleItem = container.resolve(UpdateSaleItemService);

    const saleItem = await updateSaleItem.execute(data);

    return response.json(saleItem);
  }

  public async updatePaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateSalePaymentForm = container.resolve(
      UpdateSalePaymentFormService,
    );

    const salePaymentForm = await updateSalePaymentForm.execute(data);

    return response.json(salePaymentForm);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId, saleStatus } = request.query;

    const listSales = container.resolve(ListSaleService);

    const sale = await listSales.execute(
      String(customerId),
      String(saleStatus),
    );

    return response.json(sale);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteSaleService = container.resolve(DeleteSaleService);

    await deleteSaleService.execute(String(id));

    return response.status(204).json();
  }

  public async deleteItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteSaleItemService = container.resolve(DeleteSaleItemService);

    await deleteSaleItemService.execute(String(id));

    return response.status(204).json();
  }

  public async deletePaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteSalePaymentFormService = container.resolve(
      DeleteSalePaymentFormService,
    );

    await deleteSalePaymentFormService.execute(String(id));

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

    return response.json(entrieAttach);
  }
}
