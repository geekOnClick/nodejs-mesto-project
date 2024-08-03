import {
  model, Schema
} from 'mongoose';

export interface IUser {
  name: string,
  about: string,
  avatar: string,

}

const userSchema = new Schema<IUser>({
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

export default model<IUser>('user', userSchema);