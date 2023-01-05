import { Request, Response } from 'express';
import { STATUS_400, STATUS_404, STATUS_500 } from '../utils/constants';
import Card from '../models/card';

interface IRequest extends Request {
  user?: {
    _id: string
  }
}

export const getAllCards = (req: IRequest, res: Response): void => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

export const createCard = (req: IRequest, res: Response): void => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const deleteCard = (req: IRequest, res: Response): void => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res
          .status(STATUS_400)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const likeCard = (req: IRequest, res: Response): void => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res
          .status(STATUS_404)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const dislikeCard = (req: IRequest, res: Response): void => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res
          .status(STATUS_404)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_400)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};
