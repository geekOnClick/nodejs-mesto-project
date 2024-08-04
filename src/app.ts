import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as process from 'process';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import { TControllerParameters } from './utils/types';
import cardsRouter from './routes/cards';
import {errorHandler} from "./helpers/errors/errorHandler";
import Error404 from "./helpers/errors/Error404";

require('dotenv').config();

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

app.use((...[req, _, next]: TControllerParameters) => {
  req.user = {
    _id: process.env.USER_ID || '',
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.all('*', (req, res, next) => next(new Error404('Обращение к несуществующему ресурсу')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
