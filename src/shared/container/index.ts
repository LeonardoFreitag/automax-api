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

import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import OrderItemsRepository from '@modules/order/infra/prisma/repositories/OrderItemsRepository';

import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import OrderItemPhasesRepository from '@modules/order/infra/prisma/repositories/OrderItemPhasesRepository';

import ICustomerRepository from '@modules/customer/repositories/ICustomerRepository';
import CustomerRepository from '@modules/customer/infra/prisma/repositories/CustomerRepository';

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

container.registerSingleton<IOrderItemsRepository>(
  'OrderItemsRepository',
  OrderItemsRepository,
);

container.registerSingleton<IOrderItemPhasesRepository>(
  'OrderItemPhasesRepository',
  OrderItemPhasesRepository,
);

container.registerSingleton<ICustomerRepository>(
  'CustomerRepository',
  CustomerRepository,
);
