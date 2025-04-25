import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateBudgetService from '@modules/budget/services/CreateBudgetService';
import CreateBudgetPDFService from '@modules/budget/services/CreateBudgetPDFService';
import CreateBudgetItemService from '@modules/budget/services/CreateBudgetItemService';
import CreateBudgetPaymentFormService from '@modules/budget/services/CreateBudgetPaymentFormService';
import UpdateBudgetService from '@modules/budget/services/UdpateBudgetService';
import UpdateBudgetNumberService from '@modules/budget/services/UdpateBudgetNumberService';
import UpdateBudgetStatusService from '@modules/budget/services/UdpateBudgetStatusService';
import UpdateBudgetItemService from '@modules/budget/services/UdpateBudgetItemService';
import UpdateBudgetPaymentFormService from '@modules/budget/services/UdpateBudgetPaymentFormService';
import ListBudgetService from '@modules/budget/services/ListBudgetService';
import ListBudgetByIdService from '@modules/budget/services/ListBudgetByIdService';
import ListBudgetBySellerIdService from '@modules/budget/services/ListBudgetBySellerIdService';
import ListBudgetBySellerIdAndMonthService from '@modules/budget/services/ListBudgetBySellerIdAndMonthService';
import ListBudgetPaginetedService from '@modules/budget/services/ListBudgetPaginetedService';
import ListBudgetPaginetedByCompanyNameService from '@modules/budget/services/ListBudgetPaginetedByCompanyNameService';
import DeleteBudgetService from '@modules/budget/services/DeleteBudgetService';
import DeleteBudgetItemService from '@modules/budget/services/DeleteBudgetItemService';
import DeleteBudgetPaymentFormService from '@modules/budget/services/DeleteBudgetPaymentFormService';

export default class BudgetControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      sellerId,
      budgetNumber,
      budgetDate,
      budgetExpiration,
      clientId,
      amount,
      discount,
      increment,
      total,
      notes,
      budgetStatus,
      refusedNotes,
      returnedNotes,
      BudgetItems,
      BudgetPaymentForm,
    } = request.body;

    const createBudgetService = container.resolve(CreateBudgetService);

    const newBudget = await createBudgetService.execute({
      customerId,
      sellerId,
      budgetNumber,
      budgetDate,
      budgetExpiration,
      clientId,
      amount,
      discount,
      increment,
      total,
      notes,
      budgetStatus,
      refusedNotes,
      returnedNotes,
      BudgetItems,
      BudgetPaymentForm,
    });

    const createBudgetPDF = container.resolve(CreateBudgetPDFService);

    const budgetWithPDF = await createBudgetPDF.execute(newBudget.id);

    return response.json(budgetWithPDF);
  }

  public async createItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      budgetId,
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

    const createBudgetItem = container.resolve(CreateBudgetItemService);

    const BudgetItem = await createBudgetItem.execute({
      budgetId,
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

    return response.json(BudgetItem);
  }

  public async createPaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { budgetId, paymentFormId, description, amount, installments } =
      request.body;

    const createBudgetPamentForm = container.resolve(
      CreateBudgetPaymentFormService,
    );

    const BudgetPaymentForm = await createBudgetPamentForm.execute({
      budgetId,
      paymentFormId,
      description,
      amount,
      installments,
    });

    return response.json(BudgetPaymentForm);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateBudgetStatus = container.resolve(UpdateBudgetStatusService);

    const Budget = await updateBudgetStatus.execute(data);

    return response.json(Budget);
  }

  public async updateBudgetNumber(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, budgetNumber } = request.body;

    const updateBudgetNumber = container.resolve(UpdateBudgetNumberService);

    const Budget = await updateBudgetNumber.execute(
      String(id),
      String(budgetNumber),
    );

    return response.json(Budget);
  }

  public async updateStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateBudgetStatus = container.resolve(UpdateBudgetStatusService);

    const Budget = await updateBudgetStatus.execute(data);

    return response.json(Budget);
  }

  public async updateItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateBudgetItem = container.resolve(UpdateBudgetItemService);

    const BudgetItem = await updateBudgetItem.execute(data);

    return response.json(BudgetItem);
  }

  public async updatePaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateBudgetPaymentForm = container.resolve(
      UpdateBudgetPaymentFormService,
    );

    const BudgetPaymentForm = await updateBudgetPaymentForm.execute(data);

    return response.json(BudgetPaymentForm);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId, budgetStatus } = request.query;

    const listBudgets = container.resolve(ListBudgetService);

    const budget = await listBudgets.execute(
      String(customerId),
      String(budgetStatus),
    );

    return response.json(budget);
  }

  public async listBudgetById(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const listBudgets = container.resolve(ListBudgetByIdService);

    const Budget = await listBudgets.execute(String(id));

    return response.json(Budget);
  }

  public async listBudgetBySellerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId } = request.query;

    const listBudgets = container.resolve(ListBudgetBySellerIdService);

    const Budget = await listBudgets.execute(String(sellerId));

    return response.json(Budget);
  }

  public async listBudgetBySellerIdAndMonth(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId, month, year } = request.query;

    const listBudgets = container.resolve(ListBudgetBySellerIdAndMonthService);

    const Budget = await listBudgets.execute(
      String(sellerId),
      Number(month),
      Number(year),
    );

    return response.json(Budget);
  }

  public async listBudgetsPaginated(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId, page, rows } = request.query;
    const listBudgets = container.resolve(ListBudgetPaginetedService);
    const Budget = await listBudgets.execute(
      String(sellerId),
      Number(page),
      Number(rows),
    );
    return response.json(Budget);
  }

  public async listBudgetsPaginatedByCompanyName(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sellerId, companyName, page, rows } = request.query;

    const listBudgets = container.resolve(
      ListBudgetPaginetedByCompanyNameService,
    );

    const Budget = await listBudgets.execute(
      String(sellerId),
      String(companyName),
      Number(page),
      Number(rows),
    );

    return response.json(Budget);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteBudgetService = container.resolve(DeleteBudgetService);

    await deleteBudgetService.execute(String(id));

    return response.status(204).json();
  }

  public async deleteItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteBudgetItemService = container.resolve(DeleteBudgetItemService);

    await deleteBudgetItemService.execute(String(id));

    return response.status(204).json();
  }

  public async deletePaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteBudgetPaymentFormService = container.resolve(
      DeleteBudgetPaymentFormService,
    );

    await deleteBudgetPaymentFormService.execute(String(id));

    return response.status(204).json();
  }
}
