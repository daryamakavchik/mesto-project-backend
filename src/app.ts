import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser = require('body-parser');
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { STATUS_500 } from './utils/constants';
import { createUser, login } from './controllers/users';
import router from './routes/cards';
import auth from './middlewares/auth';

interface IError extends Error {
  statusCode?: number
}

const { errors } = require('celebrate');

const { PORT = 3000, LINK = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
const connectDb = async (): Promise<any> => {
  await mongoose.connect(LINK).then(
    () => {
      console.info('Connected to database');
    },
  );
};

connectDb().catch((error) => console.error(error));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(auth);
app.use(errors());
app.use('/', router);
app.post('/signin', login);
app.post('/signup', createUser);
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_500
        ? 'Произошла ошибка на сервере'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
