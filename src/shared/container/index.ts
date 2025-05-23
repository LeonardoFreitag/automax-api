import { container } from 'tsyringe';

import '@modules/users/providers';
import '@shared/container/providers';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/prisma/repositories/UserRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/prisma/repositories/UserTokensRepository';

import IUserRefreshTokensRepository from '@modules/users/repositories/IUserRefreshTokensRepository';
import UserRefreshTokensRepository from '@modules/users/infra/prisma/repositories/UserRefreshTokensRepository';

import IClientRepository from '@modules/client/repositories/IClientRepository';
import ClientRepository from '@modules/client/infra/prisma/repositories/ClientRepository';

import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';
import ClientTempRepository from '@modules/clientTemp/infra/prisma/repositories/ClientTempRepository';

import IProductRepository from '@modules/product/repositories/IProductRepository';
import ProductRepository from '@modules/product/infra/prisma/repositories/ProductRepository';

import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import ProductTissueRepository from '@modules/productTissue/infra/prisma/repositories/ProductTissueRepository';

import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import GroupRepository from '@modules/group/infra/prisma/repositories/GroupRepository';

import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import SaleRepository from '@modules/sale/infra/prisma/repositories/SaleRepository';

import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import OrderRepository from '@modules/order/infra/prisma/repositories/OrderRepository';

import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import OrderItemsPhasesRepository from '@modules/order/infra/prisma/repositories/OrderItemsPhasesRepository';

import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import CustomerRepository from '@modules/customer/infra/prisma/repositories/CustomerRepository';

import IPhasesRepository from '@modules/phases/repositories/IPhasesRepository';
import PhasesRepository from '@modules/phases/infra/prisma/repositories/PhasesRepository';

import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import RegistroRepository from '@modules/registro/infra/prisma/repositories/RegistroRepository';

import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import BudgetRepository from '@modules/budget/infra/prisma/respositories/BudgetRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IUserRefreshTokensRepository>(
  'UserRefreshTokensRepository',
  UserRefreshTokensRepository,
);

container.registerSingleton<IClientRepository>(
  'ClientRepository',
  ClientRepository,
);

container.registerSingleton<IClientTempRepository>(
  'ClientTempRepository',
  ClientTempRepository,
);

container.registerSingleton<IGroupRepository>(
  'GroupRepository',
  GroupRepository,
);

container.registerSingleton<IProductRepository>(
  'ProductRepository',
  ProductRepository,
);

container.registerSingleton<IProductTissueRepository>(
  'ProductTissueRepository',
  ProductTissueRepository,
);

container.registerSingleton<ISaleRepository>('SaleRepository', SaleRepository);

container.registerSingleton<IOrderRepository>(
  'OrderRepository',
  OrderRepository,
);

container.registerSingleton<IOrderItemsPhasesRepository>(
  'OrderItemsPhasesRepository',
  OrderItemsPhasesRepository,
);

container.registerSingleton<ICustomerRepository>(
  'CustomerRepository',
  CustomerRepository,
);

container.registerSingleton<IPhasesRepository>(
  'PhasesRepository',
  PhasesRepository,
);

container.registerSingleton<IRegistroRepository>(
  'RegistroRepository',
  RegistroRepository,
);

container.registerSingleton<IBudgetRepository>(
  'BudgetRepository',
  BudgetRepository,
);
