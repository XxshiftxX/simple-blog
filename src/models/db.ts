import { connect, connection } from 'mongoose'

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
