import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { constants } from 'http2';
import User from '../models/user';
import Error404 from '../helpers/errors/Error404';
import { TUpdatedRequest } from '../utils/types';
import Error409 from '../helpers/errors/Error409';

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => {
    res.send({ data: users });
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

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  return User.create({
    email,
    password: hash,
    name,
    about,
    avatar,
  })
    .then((user) => {
      const { HTTP_STATUS_CREATED } = constants;
      res
        .status(HTTP_STATUS_CREATED)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.code === 409 || err.code === 11000) {
        return next(new Error409('Создание дублирующей записи'));
      } return next(err);
    });
};

export const updateUser = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
  )
    .then((user) => res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name,
      about,
    }))
    .catch(() => next(new Error404('Запрашиваемый пользователь не найден')));
};

export const updateUserAvatar = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
  )
    .then((user) => res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name: user?.name,
      about: user?.about,
    }))
    .catch(() => next(new Error404('Запрашиваемый пользователь не найден')));
};

export const getUserData = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findOne({ _id: userId })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};