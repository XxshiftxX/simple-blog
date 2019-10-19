import * as express from 'express'

import './models/post'
import './models/user'
import { HttpError } from './utils/error'

type Request = express.Request
type Response = express.Response
type NextFunc = express.NextFunction

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.end('Hello world!')
})

app.use((req: Request, res: Response, next: NextFunc) => {
  let error = new HttpError(404, 'Not Found')
  error.status = 404
  next(error)
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunc) => {
  res.status(err.status || 500).json({
    message: err.message,
    data: err.data
  })
})

export default app
