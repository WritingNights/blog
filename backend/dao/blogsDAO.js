import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let blogs

export default class BlogsDAO {
  static async injectDB(conn) {
    if (blogs) {
      return
    }
    try {
      blogs = await conn.db(process.env.RESTBLOG_NS).collection("blogs")
    } catch (e) {
      console.error(`Unable to establish a collection handle in blogsDAO: ${e}`)
    }
  }

  static async getBlogs({
    filters = null,
    page = 0,
    blogsPerPage = 20
  } = {}) {
    let query = {}
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } }
      } else if ("author" in filters) {
        query = { "author": filters["author"] }
      }
    }

    const pipeline = [ {
      $match: query
    }, {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "blog_id",
        as: "posts"
      }
    }, {
      $addFields: {
        postCount: { $size: "$posts" }
      }
    } ];

    try {
      const blogList = await blogs.aggregate(pipeline).toArray()
      const totalBlogs = await blogs.countDocuments(query)

      return { blogList, totalBlogs }
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
      return { blogList: [], totalBlogs: 0 }
    }
  }

  static async getBlogByID(id, edit = '') {
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
            localField: "author",
            foreignField: "username",
            as: "user"
          }
        }, {
          $lookup: {
            from: "posts",
            let: { id: "$_id" },
            pipeline: [ {
              $match: {
                $expr: {
                  $eq: ["$blog_id", "$$id"]
                }
              }
            }, {
              $sort: { date: 1 }
            } ],
            as: "posts"
          }
        }, {
          $addFields: {
            posts: "$posts",
            user: "$user"
          }
        } ]
      }
      return await blogs.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getBlogByID: ${e}`)
      throw e
    }
  }

  static async getBlogsByUserId(userId) {
    try {
      const pipeline = [ {
        $match: {
          user_id: new ObjectId(userId)
        }
      } ]
      return await blogs.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getBlogsByUserId: ${e}`)
      throw e
    }
  }

  static async addBlog(title, blog, user, date) {
    try {
      const blogDoc = {
        author: user.name,
        user_id: user._id,
        title: title,
        text: blog,
        date: date
      }

      return await blogs.insertOne(blogDoc)
    } catch (e) {
      console.error(`Unable to post blog: ${e}`)
      return { error: e }
    }
  }

  static async updateBlog(blogId, userId, title, text, date) {
    try {
      const updateResponse = await blogs.updateOne(
        { user_id: userId, _id: ObjectId(blogId) },
        { $set: { title: title, text: text, date: date } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update blog: ${e}`)
      return { error: e }
    }
  }

  static async deleteBlog(blogId, userId) {
    try {
      const deleteResponse = await blogs.deleteOne({
        _id: ObjectId(blogId),
        user_id: userId
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete blog: ${e}`)
      return { error: e }
    }
  }
}