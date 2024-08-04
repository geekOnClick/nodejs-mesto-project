import express, { Request, Response, NextFunction } from 'express';

export type TUpdatedRequest = Request & Partial<{ user: { _id: string } }>

export type TController = Record<
  string,
  (
    req: TUpdatedRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<any> | any
>;
/** тип для параметров контроллера */
export type TControllerParameters = Parameters<TController[string]>;

export type TUser = {
  _id: string
  name?: string,
  about?: string,
  avatar?: string,
  email: string,
  password: string
};
