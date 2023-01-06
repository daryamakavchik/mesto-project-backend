import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser = require('body-parser');
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import router from './routes/cards';

interface IRequest extends Request {
  user?: {
    _id: string
  }
}

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

app.use((req: IRequest, res: Response, next) => {
  req.user = {
    _id: '63b379b8ac6a6ffccb994945',
  };

  next();
});

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
app.use('/', router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
