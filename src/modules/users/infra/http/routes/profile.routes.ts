import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import { JoinColumn } from 'typeorm';

const profileRouter = Router();
const profileController = new ProfileController();

// profileRouter.use(ensureAuthenticated);

profileRouter.get('/', ensureAuthenticated, profileController.show);

profileRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().uuid().required(),
      isAdmin: Joi.bool().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      oldPassword: Joi.string().required(),
      isCommissioned: Joi.boolean().required(),
      comissionPercentage: Joi.number().required(),
      rules: Joi.array().required(),
    },
  }),
  profileController.update,
);

export default profileRouter;
