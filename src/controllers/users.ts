import { Request, Response } from 'express';
import { STATUS_400, STATUS_404, STATUS_500 } from '../utils/constants';
import User from '../models/user';

interface IRequest extends Request {
  user?: {
    _id: string
  }
}

export const getAllUsers = (req: Request, res: Response): void => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' }));
};

export const createUser = (req: Request, res: Response): void => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res
        .status(STATUS_500)
        .send({ message: 'Произошла ошибка на сервере' });
    });
};

export const findUserById = (req: Request, res: Response): void => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidUserData'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidUserData') {
        res
          .status(STATUS_404)
          .send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'BadRequestError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const updateUserInfo = (req: IRequest, res: Response): void => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error('NotValidUserData'))
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidUserData') {
        res
          .status(STATUS_404)
          .send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'BadRequestError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const updateUserAvatar = (req: IRequest, res: Response): void => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error('NotValidUserData'))
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidUserData') {
        res
          .status(STATUS_404)
          .send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'BadRequestError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' });
    });
};
