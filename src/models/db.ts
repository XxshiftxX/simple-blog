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
