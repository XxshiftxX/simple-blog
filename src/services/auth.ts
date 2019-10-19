import { User, UserDB } from '../models/user'
import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../utils/error'

const getUser = (obj: any) => {
  const { email, password, nickname } = obj
  return { email, password, nickname } as User
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

  if (await checkUserDuplicated(user.email)) {
    next(new HttpError(400, 'user already exist', user))
    return
  }

  await UserDB.create(user)
  res.json({ data: user })
}
