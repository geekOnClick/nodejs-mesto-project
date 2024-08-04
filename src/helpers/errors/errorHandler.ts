import { Request, NextFunction, Response } from 'express';
import * as http2 from 'http2';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST } = http2.constants;
  const databaseErrors = {
    ValidationError: {
      status: HTTP_STATUS_BAD_REQUEST,
      message: 'Данные не прошли валидацию',
    },
    CastError: {
      status: HTTP_STATUS_BAD_REQUEST,
      message: 'Невалидный id записи',
    },
    DocumentNotFoundError: {
      status: HTTP_STATUS_NOT_FOUND,
      message: 'В базе данных не найдена запись подходящая по параметрам запроса',
    },
  };
  let { statusCode = 500, message } = err;
  type tDatabaseErrorKey = keyof typeof databaseErrors;

  // eslint-disable-next-line max-len
  const databaseErrorsKeys: tDatabaseErrorKey[] = Object.keys(databaseErrors) as tDatabaseErrorKey[];
  databaseErrorsKeys.forEach((errorKey: tDatabaseErrorKey) => {
    if (err.stack.includes(errorKey)) {
      statusCode = databaseErrors[errorKey].status;
      message = databaseErrors[errorKey].message;
    }
  });
  res
    .status(statusCode)
    .send({
      // eslint-disable-next-line no-nested-ternary
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
