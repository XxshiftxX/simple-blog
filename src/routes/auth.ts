import * as express from 'express'

import { signUp, duplicated } from '../services/auth'

export const route = express.Router()

route.get('/duplicated', duplicated)
route.post('/signup', signUp)
