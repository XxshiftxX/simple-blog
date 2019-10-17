import * as mongoose from 'mongoose'

export interface Post extends mongoose.Document {
  title: string
  content: string
  author: string
  comments: Comment[]
}

export interface Comment extends mongoose.Document {
  title: string
  content: string
  author: string
}

const commentSchema = new mongoose.Schema({
  email: { type: String , required: true },
  password: { type: String, required: true },
  author: { type: String, required: true }
})

const postSchema = new mongoose.Schema({
  email: { type: String , required: true },
  password: { type: String, required: true },
  author: { type: String, required: true },
  comments: { type: [commentSchema], default: [] }
})

export const PostModel: mongoose.Model<Post> = mongoose.model<Post>('Post', postSchema)
