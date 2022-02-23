import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let posts

export default class PostsDAO {
  static async injectDB(conn) {
    if (posts) {
      return
    }
    try {
        posts = await conn.db(process.env.RESTBLOG_NS).collection("posts")
    } catch (e) {
        console.error(`Unable to esatablish collection handles in userDAO: ${e}`)
    }
  }

  static async getPostByID(id, edit = '') {
    try {
      let pipeline
      if (edit) {
        pipeline = [ {
          $match: { _id: new ObjectId(id) }
        } ]
      } else {
        pipeline = [ {
          $match: { _id: new ObjectId(id) }
        }, {
          $lookup: {
            from: "users",
            localField: "name",
            foreignField: "username",
            as: "user"
          }
        }, {
          $addFields: { user: "$user" }
        } ]
      }
      return await posts.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getPostByID: ${e}`)
      throw e
    }
  }

  static async getPostsByBlogId(blogId) {
    try {
      const pipeline = [ {
        $match: {
          blog_id: new ObjectId(blogId)
        }
      } ]
      return await posts.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getPostsByBlogId: ${e}`)
      throw e
    }
  }

  static async addPost(blogId, user, title, post, date) {
    try {
      const postDoc = {
        name: user.name,
        user_id: user._id,
        title: title,
        text: post,
        blog_id: ObjectId(blogId),
        date: date
      }

      return await posts.insertOne(postDoc)
    } catch (e) {
      console.error(`Unable to post post: ${e}`);
      return { error: e };
    }
  }

  static async updatePost(postId, userId, title, text, date) {
    try {
      const updateResponse = await posts.updateOne(
        { user_id: userId, _id: ObjectId(postId) },
        { $set: { title: title, text: text, date: date } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update post: ${e}`)
      return { error: e }
    }
  }

  static async deletePost(postId, userId) {
    try {
      const deleteResponse = await posts.deleteOne({
        _id: ObjectId(postId),
        user_id: userId
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete post: ${e}`)
      return { error: e }
    }
  }
}