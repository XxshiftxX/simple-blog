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
