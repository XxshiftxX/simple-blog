import * as express from 'express'

import { signUp } from '../services/auth'

export const route = express.Router()

route.get('/test', (req: express.Request, res: express.Response) => {
  res.json({ test: 'test' })
})
route.post('/signup', signUp)
