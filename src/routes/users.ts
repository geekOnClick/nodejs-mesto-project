import {
  NextFunction, Router, Request, Response,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser, getAllUsers, getUserById, getUserData, updateUser, updateUserAvatar,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('', getAllUsers);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}), getUserById);

usersRouter.post(
  '',
  createUser,
);

usersRouter.patch(
  '/me',
  updateUser,
);

usersRouter.patch(
  '/me/avatar',
  updateUserAvatar,
);

usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}), getUserData);
export default usersRouter;
