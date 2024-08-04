import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as process from 'process';
import { celebrate, errors, Joi } from 'celebrate';
import usersRouter from './routes/users';
import { TControllerParameters } from './utils/types';
import cardsRouter from './routes/cards';
import { errorHandler } from './helpers/errors/errorHandler';
import Error404 from './helpers/errors/Error404';
import { createUser } from './controllers/users';
import { login } from './controllers/login';
import { checkAuthorization } from './middlewares/auth';
import {errorLogger, requestLogger} from "./middlewares/logger";

require('dotenv').config();

const cookieParser = require('cookie-parser');

const allowCors = (req: Request, res: Response, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};

mongoose.connect(process.env.MONGO_URL || '');

const db = mongoose.connection;
db.on('error', (err) => {
  console.log('error', err);
});
db.once('open', () => {
  console.log('DB connection Successful!');
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(allowCors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(16),
    name: Joi.string().min(20).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }).unknown(true),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(16),
  }),
}), login);
app.use(checkAuthorization);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.all('*', (req, res, next) => next(new Error404('Обращение к несуществующему ресурсу')));
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
