import {NextFunction, Request, Response} from "express";
import User from "../models/user";
import Error404 from "../helpers/errors/Error404";
import {TUpdatedRequest} from "../utils/types";

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => {
    res.send({data: users})
  })
  .catch(next);

// eslint-disable-next-line max-len
export const getUserById = (req: Request, res: Response, next: NextFunction) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new Error404('Пользователь с указанным _id не найден');
    }
    res.send({ data: user });
  })
  .catch(next);

export const createUser = (req: Request, res: Response) => {
  User.create({
    ...req.body
  })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
}

export const updateUser = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about }
  )
    .then((user) =>res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name,
      about,
    }))
    .catch((err) => next(new Error404("Запрашиваемый пользователь не найден")));
}

export const updateUserAvatar = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar }
  )
    .then((user) =>res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name: user?.name,
      about: user?.about
    }))
    .catch((err) => next(new Error404("Запрашиваемый пользователь не найден")));
}