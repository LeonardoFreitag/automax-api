import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/user.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import clientRouter from '@modules/client/infra/http/routes/client.routes';
import productRouter from '@modules/product/infra/http/routes/product.routes';
import saleRouter from '@modules/sale/infra/http/routes/sale.routes';
import orderRouter from '@modules/order/infra/http/routes/order.routes';
import orderItemRouter from '@modules/order/infra/http/routes/orderItem.routes';
import orderItemPhaseRouter from '@modules/order/infra/http/routes/orderItemPhase.routes';

const routes = Router();

// users
routes.use('/user', usersRouter);
routes.use('/users/sessions', sessionsRouter);
routes.use('/users/password', passwordRouter);
routes.use('/users/profile', profileRouter);

// client
routes.use('/client', clientRouter);

// product
routes.use('/product', productRouter);

// sale
routes.use('/sale', saleRouter);

// order
routes.use('/order', orderRouter);
routes.use('/orderItem', orderItemRouter);
routes.use('/orderItemPhase', orderItemPhaseRouter);

export default routes;
