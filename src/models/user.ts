import mongoose, { Model, Document } from 'mongoose';

const bcrypt = require('bcrypt');
const isEmailValidator = require('validator').isEmail;

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: any) => isEmailValidator(v),
      message: 'Неправильный формат почты',
    },
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).then((user:any) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password).then((matched:any) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user;
    });
  });
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
