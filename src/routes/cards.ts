import {Router} from "express";
import {createCard, deleteCardById, dislikeCard, getAllCards, likeCard} from "../controllers/cards";
import {celebrate, Joi} from "celebrate";

const cardsRouter = Router();

cardsRouter.get('', getAllCards);

cardsRouter.post(
  '',celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), createCard);

cardsRouter.delete(
  '/:cardId',
celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex(),
  }),
}),
deleteCardById,
);

cardsRouter.put(
  '/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), likeCard)

cardsRouter.delete(
  '/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), dislikeCard);

export default cardsRouter;