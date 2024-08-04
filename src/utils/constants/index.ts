import * as http2 from "http2";

export const {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST

} = http2.constants

export const STATUS_CODES = {
  Error409: 409,
  Error500: 500,
  Error11000: 11000
}

export const ERROR_MESSAGES = {
  ValidationError: 'Данные не прошли валидацию',
  CastError: 'Невалидный id записи',
  UserNotExists: 'Пользователь с указанным _id не найден',
  PersonNotExists: 'Запрашиваемый пользователь не найден',
  DocumentNotFoundError: 'В базе данных не найдена запись подходящая по параметрам запроса',
  ServerError: 'На сервере произошла ошибка',
  AuthRequired: 'необходима авторизация',
  AccessDenied: 'Неправильные почта или пароль',
  DublicateItem: 'Создание дублирующей записи',
  ResourceNotFound: 'Обращение к несуществующему ресурсу'
}