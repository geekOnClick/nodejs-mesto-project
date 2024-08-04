import { NextFunction, Request, Response } from 'express';
import { TControllerParameters, TUpdatedRequest } from '../utils/types';
import User from '../models/user';
import Card from '../models/card';
import Error404 from '../helpers/errors/Error404';
import {ERROR_MESSAGES} from "../utils/constants";
import { STATUS_CODES } from 'http';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    res.send({ data: cards });
  })
  .catch((err) => {
    next();
  });

export const createCard = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  Card.create({ name, link, owner })
    .then((user) => res.send(user))
    .catch((err) => res.status(Number(STATUS_CODES.Error400)).send(err));
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new Error404(ERROR_MESSAGES.UserNotExists);
    }
    res.send({ data: card });
  })
  .catch(next);

export const likeCard = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    res.send({ data: card });
  })
    .catch((err) => next(new Error404(ERROR_MESSAGES.PersonNotExists)));
};

export const dislikeCard = (req: TUpdatedRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    res.send({ data: card });
  })
    .catch((err) => next(new Error404(ERROR_MESSAGES.PersonNotExists)));
};
