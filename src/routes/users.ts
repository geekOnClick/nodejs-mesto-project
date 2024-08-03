import {NextFunction, Router, Request, Response} from "express";
import {createUser, getAllUsers, getUserById, updateUser, updateUserAvatar} from "../controllers/users";
import {celebrate, Joi} from "celebrate";


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

export default usersRouter;
