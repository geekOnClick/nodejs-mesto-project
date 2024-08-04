import {
  model, Model, Schema, Document,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import Error401 from '../helpers/errors/Error401';
import { TUser } from '../utils/types';
import {ERROR_MESSAGES} from "../utils/constants";

export interface IUser {
  name?: string,
  about?: string,
  avatar?: string,
  email: string,
  password: string
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v: string) {
        return /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(v);
      },
      message: (props) => `${props.value} email не прошел проверку на формат`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 3,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    validate: {
      validator(v: string) {
        return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/.test(v);
      },
      message: (props) => `${props.value} не валидная ссылка на аватар`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: TUser) => {
      if (!user) {
        return Promise.reject(new Error401(ERROR_MESSAGES.AccessDenied));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error401(ERROR_MESSAGES.AccessDenied));
        }
        return user;
      });
    });
});

export default model<IUser, UserModel>('user', userSchema);
