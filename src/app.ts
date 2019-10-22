import * as express from 'express'

import './models/post'
import './models/user'
import * as routes from './routes'
import { HttpError } from './utils/error'

type Request = express.Request
type Response = express.Response
type NextFunc = express.NextFunction

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.end('Hello world!')
})

app.use('/api/auth', routes.AuthRouter)

app.use((req: Request, res: Response, next: NextFunc) => {
  let error = new HttpError(404, 'Not Found')
  next(error)
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunc) => {
  res.status(err.status || 500).json({
    message: err.message,
    data: err.data
  })
})

export default app
