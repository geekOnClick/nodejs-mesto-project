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
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

usersRouter.post(
  '', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(16),
    name: Joi.string().min(20).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }).unknown(true),
}),
  createUser,
);

usersRouter.patch(
  '/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(20).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);

usersRouter.patch(
  '/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), updateUserAvatar);

usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserData);
export default usersRouter;
