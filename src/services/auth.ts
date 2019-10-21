import { Request, Response, NextFunction } from 'express'
import { createHmac } from 'crypto'
import { sign } from 'jsonwebtoken'

import * as config from '../config'
import { User, UserDB } from '../models/user'
import { HttpError } from '../utils/error'

const encryptValue = (value: string) => {
  return createHmac('sha1', config.secret)
    .update(value)
    .digest('base64')
}

const getEncryptedUser = (obj: any) => {
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

const verifyPassword = (password: string, input: string) => {
  const encrypted = encryptValue(input)
  return password === encrypted
}

const getJWTToken = (payload: any) => sign(payload, config.secret, { expiresIn: '7d', issuer: 'dev-shift.me' })

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  if (await checkUserDuplicated(req.body.email)) {
    next(new HttpError(400, 'user already exist', { data: req.body }))
    return
  }

  const user = getEncryptedUser(req.body)

  await UserDB.create(user)

  res.json({ data: req.body })
}

export const duplicated = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.query

  if (!email) {
    next(new HttpError(400, 'request data missing'))
    return
  }

  const result = await checkUserDuplicated(email)
  res.json({ email, result })
}

export const login = async  (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    next(new HttpError(400, 'request data missing'))
    return
  }

  const [ user ] = await UserDB.find({ email })
  if (!user) {
    next(new HttpError(404, 'user not found'))
    return
  }
  if (!verifyPassword(user.password, password)) {
    next(new HttpError(401, 'wrong password'))
    return
  }

  const payload = {
    _id: user._id,
    email: user.email
  }
  const token = getJWTToken(payload)
  res.json({ data: { token } })
}
