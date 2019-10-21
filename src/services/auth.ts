import { Request, Response, NextFunction } from 'express'
import { createHmac } from 'crypto'

import * as config from '../config'
import { User, UserDB } from '../models/user'
import { HttpError } from '../utils/error'
import { runInNewContext } from 'vm'

const encryptValue = (value: string) => {
  return createHmac('sha1', config.secret)
    .update(value)
    .digest('base64')
}

const getUser = (obj: any) => {
  const { email, password, nickname } = obj

  const encrypted = encryptValue(password)

  return { email, password: encrypted, nickname } as User
}

const checkUserDuplicated = async (email: string) => {
  const user = await UserDB.find({ email })

  if (user.length > 0) {
    return true
  }
  return false
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const user = getUser(req.body)
  const info = {
    data: {
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname
    }
  }

  if (await checkUserDuplicated(user.email)) {
    next(new HttpError(400, 'user already exist', info))
    return
  }

  await UserDB.create(user)

  res.json(info)
}

export const duplicated = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.query
  if (!email) {
    next(new HttpError(400, 'no email'))
    return
  }

  const result = await checkUserDuplicated(email)
  res.json({ email, result })
}
