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
  id: { type: Number, auto: true },
  title: { type: String , required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }
})

const postSchema = new mongoose.Schema({
  id: { type: Number, auto: true },
  title: { type: String , required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  comments: { type: [commentSchema], default: [] }
})

export const PostModel: mongoose.Model<Post> = mongoose.model<Post>('Post', postSchema)

class DB {
  create (post: Post) {
    const model = new PostModel(post)
    return model.save()
  }

  find (query: any): Promise<Post[]> {
    return new Promise((resolve, reject) => {
      PostModel.find(query, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  update (post: Post, id: number) {
    return PostModel.update({ id }, { ...post })
  }

  delete (id: number) {
    return PostModel.remove({ id })
  }
}

export const PostDB = new DB()
