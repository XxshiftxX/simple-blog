import { connect, connection } from 'mongoose'

import { dbURL } from '../config'

const connectDB = () => {
  const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  connect(dbURL, option)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.error('MongoDB connection error', error)
  })
}

connectDB()
connection.on('disconnected', connectDB)
