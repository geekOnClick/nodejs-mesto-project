import { Request, NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import process from 'process';
import Error401 from '../helpers/errors/Error401';
import {ERROR_MESSAGES} from "../utils/constants";

export interface SessionRequest extends Request {
  user?: {id: string} | JwtPayload;
}

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new Error401(ERROR_MESSAGES.AuthRequired));
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_PRIVATE || '');
  } catch (err) {
    console.log('err', err);
    return next(new Error401(ERROR_MESSAGES.AuthRequired));
  }
  // @ts-ignore
  req.user = payload;
  next();
}
