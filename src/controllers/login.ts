import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import process from 'process';
import User from '../models/user';

// eslint-disable-next-line import/prefer-default-export
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user: any) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_PRIVATE || '', { expiresIn: '7 days' });
    res
      .send({
        token,
      });
  })
    .catch(next);
};
