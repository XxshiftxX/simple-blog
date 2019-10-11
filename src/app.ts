import * as express from 'express'

type Request = express.Request
type Response = express.Response
type NextFunc = express.NextFunction

interface HttpError extends Error {
  status: number
  data?: any
}

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.end('Hello world!')
})

app.use((req: Request, res: Response, next: NextFunc) => {
  let error = new Error('Not Found') as HttpError
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
