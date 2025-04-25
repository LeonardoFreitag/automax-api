import { Router } from 'express';

import customerRouter from '@modules/customer/infra/http/routes/customer.routes';
import phasesRouter from '@modules/phases/infra/http/routes/phases.routes';
import usersRouter from '@modules/users/infra/http/routes/user.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import clientRouter from '@modules/client/infra/http/routes/client.routes';
import clientTempRouter from '@modules/clientTemp/infra/http/routes/clientTemp.routes';
import groupRouter from '@modules/group/infra/http/routes/group.routes';
import productRouter from '@modules/product/infra/http/routes/product.routes';
import productTissueRouter from '@modules/productTissue/infra/http/routes/productTissue.routes';
import saleRouter from '@modules/sale/infra/http/routes/sale.routes';
import budgetRouter from '@modules/budget/infra/http/routes/budget.routes';
import orderRouter from '@modules/order/infra/http/routes/order.routes';
import orderItemsPhasesRouter from '@modules/order/infra/http/routes/orderItemsPhases.routes';
import registroRouter from '@modules/registro/infra/http/routes/registro.routes';

const routes = Router();

// phases
routes.use('/phases', phasesRouter);

// customer
routes.use('/customer', customerRouter);

// users
routes.use('/user', usersRouter);
routes.use('/users/sessions', sessionsRouter);
routes.use('/users/password', passwordRouter);

// client
routes.use('/client', clientRouter);

// clientTemp
routes.use('/clientTemp', clientTempRouter);

// product
routes.use('/group', groupRouter);
routes.use('/product', productRouter);
routes.use('/tissue', productTissueRouter);

// sale
routes.use('/sale', saleRouter);

// budget
routes.use('/budget', budgetRouter);

// order
routes.use('/order', orderRouter);
routes.use('/orderItemsPhases', orderItemsPhasesRouter);

routes.use('/registro', registroRouter);

export default routes;
