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

import IProductRepository from '@modules/product/repositories/IProductRepository';
import ProductRepository from '@modules/product/infra/prisma/repositories/ProductRepository';

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

container.registerSingleton<IGroupRepository>(
  'GroupRepository',
  GroupRepository,
);
container.registerSingleton<IProductRepository>(
  'ProductRepository',
  ProductRepository,
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
