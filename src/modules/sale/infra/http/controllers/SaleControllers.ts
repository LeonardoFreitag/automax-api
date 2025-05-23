import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSaleService from '@modules/sale/services/CreateSaleService';
import CreateSaleItemService from '@modules/sale/services/CreateSaleItemService';
import CreateSalePaymentFormService from '@modules/sale/services/CreateSalePaymentFormService';
import UpdateSaleService from '@modules/sale/services/UdpateSaleService';
import UpdateSaleNumberService from '@modules/sale/services/UdpateSaleNumberService';
import UpdateSaleStatusService from '@modules/sale/services/UdpateSaleStatusService';
import UpdateSaleItemService from '@modules/sale/services/UdpateSaleItemService';
import UpdateSalePaymentFormService from '@modules/sale/services/UdpateSalePaymentFormService';
import ListSaleService from '@modules/sale/services/ListSaleService';
import ListSaleByIdService from '@modules/sale/services/ListSaleByIdService';
import ListSaleBySellerIdService from '@modules/sale/services/ListSaleBySellerIdService';
import ListSaleBySellerIdAndMonthService from '@modules/sale/services/ListSaleBySellerIdAndMonthService';
import ListSalesPaginetedService from '@modules/sale/services/ListSalesPaginetedService';
import ListSalesPaginetedByCompanyNameService from '@modules/sale/services/ListSalesPaginetedByCompanyNameService';
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

  public async updateSaleNumber(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, saleNumber } = request.body;

    const updateSaleNumber = container.resolve(UpdateSaleNumberService);

    const sale = await updateSaleNumber.execute(String(id), String(saleNumber));

    return response.json(sale);
  }

  public async updateStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateSaleStatus = container.resolve(UpdateSaleStatusService);

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

  public async listSaleById(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const listSales = container.resolve(ListSaleByIdService);

    const sale = await listSales.execute(String(id));

    return response.json(sale);
  }

  public async listSaleBySellerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId } = request.query;

    const listSales = container.resolve(ListSaleBySellerIdService);

    const sale = await listSales.execute(String(sellerId));

    return response.json(sale);
  }

  public async listSaleBySellerIdAndMonth(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId, month, year } = request.query;

    const listSales = container.resolve(ListSaleBySellerIdAndMonthService);

    const sale = await listSales.execute(
      String(sellerId),
      Number(month),
      Number(year),
    );

    return response.json(sale);
  }

  public async listSalesPaginated(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId, page, rows } = request.query;
    const listSales = container.resolve(ListSalesPaginetedService);
    const sale = await listSales.execute(
      String(sellerId),
      Number(page),
      Number(rows),
    );
    return response.json(sale);
  }

  public async listSalesPaginatedByCompanyName(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId, companyName, page, rows } = request.query;

    const listSales = container.resolve(ListSalesPaginetedByCompanyNameService);

    const sale = await listSales.execute(
      String(sellerId),
      String(companyName),
      Number(page),
      Number(rows),
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
    const { saleId, size } = request.body;
    const uploadSignatureService = container.resolve(UploadSignatureService);
    const id = String(saleId);
    const sz = String(size);
    const saleWithAttatch = await uploadSignatureService.execute({
      saleId: id,
      signatureSize: sz,
      signatureFileName: request.file.filename,
    });

    if (saleWithAttatch.id === undefined) {
      return response.status(201).json({ error: 'Sale not found!' });
    }

    return response.json(saleWithAttatch);
  }
}
