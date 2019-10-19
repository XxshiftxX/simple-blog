import { connect, connection, Document } from 'mongoose'

import { User, UserModel } from './user'
import { PostModel, Post } from './post'

const connectDB = () => {
  const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  connect('mongodb://localhost:27017/zennvote', option)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.error('MongoDB connection error', error)
  })
}

connectDB()
connection.on('disconnected', connectDB)

export class UserDB {
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

export class PostDB {
  create (post: Post) {
    const model = new PostModel(post)
    return model.save()
  }

  find (query: any) {
    return UserModel.find(query)
  }

  update (post: Post, id: number) {
    return UserModel.update({ id }, { ...post })
  }

  delete (id: number) {
    return UserModel.remove({ id })
  }
}
