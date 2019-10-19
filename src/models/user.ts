import * as mongoose from 'mongoose'

export interface User extends mongoose.Document {
  email: string
  password: string
  nickname?: string
}

const userSchema = new mongoose.Schema({
  email: { type: String , required: true },
  password: { type: String, required: true },
  nickname: { type: String }
})

export const UserModel: mongoose.Model<User> = mongoose.model<User>('User', userSchema)

class DB {
  create (user: User) {
    const model = new UserModel(user)
    return model.save()
  }

  find (query: any) {
    return UserModel.find(query)
  }

  update (user: User) {
    const { email } = user
    return UserModel.update({ email }, { ...user })
  }

  delete (user: User) {
    const { email } = user
    return UserModel.remove({ email })
  }
}

export const UserDB = new DB()
