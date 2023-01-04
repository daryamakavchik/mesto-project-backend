import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import router from './routes/cards'
import bodyParser = require('body-parser')

interface IRequest extends Request {
  user?: {
    _id: string
  }
}

const { PORT = 3000 } = process.env

const app = express()
const connectDb = async (): Promise<any> => {
  await mongoose.connect('mongodb://localhost:27017/mestodb').then(
    () => {
      console.info('Connected to database')
    }
  )
}

connectDb().catch(error => console.error(error))

app.use((req: IRequest, res: Response, next) => {
  req.user = {
    _id: '63b379b8ac6a6ffccb994945'
  }

  next()
})
app.use(bodyParser.urlencoded({ extended: false })) // Parses urlencoded bodies
app.use(bodyParser.json())
app.use(express.json())

app.use('/', router)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
