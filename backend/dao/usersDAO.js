import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let users

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db(process.env.RESTBLOG_NS).collection("users")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async getUsers(username = '') {
    let query = username ? { "username": { $eq: username } } : null

    let cursor

    try {
      cursor = await users
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { userList: [], totalUsers: 0 }
    }

    try {
      const userList = await cursor.toArray()
      console.log(query, userList)
      const totalUsers = await users.countDocuments(query)

      return { userList, totalUsers }
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
      return { userList: [], totalUsers: 0 }
    }
  }

  static async getProfile(username) {
    try {
      const pipeline = [ {
        $match: {
          username: username
        }
      }, {
        $lookup: {
          from: "blogs",
          localField: "username",
          foreignField: "author",
          as: "blogs"
        }
      }, {
        $addFields: { blogs: "$blogs" }
      } ]
      return await users.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getProfile: ${e}`)
      throw e
    }
  }

  static async getUserByID(id) {
    try {
      const pipeline = [ {
        $match: {
          _id: new ObjectId(id)
        }
      }, {
        $lookup: {
          from: "",
          let: {
            id: "$_id"
          },
          pipeline: [ {
            $match: {
              $expr: {
                $eq: ["$user_id", "$$blog_id"]
              }
            }
          }, {
            $sort: {
              date: -1
            }
          } ],
          as: "blogs"
        }
      }, {
        $addFields: {
          blogs: "$blogs"
        }
      } ]
      return await users.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getUserByID: ${e}`)
      throw e
    }
  }

  static async addUser(username, password, date) {
    try {
      const userDoc = {
        username: username,
        password: password,
        date: date
      }

      return await users.insertOne(userDoc)
    } catch (e) {
      console.error(`Unable to post user: ${e}`)
      return { error: e }
    }
  }

  static async updateUser(userId, password, date) {
    try {
      const updateResponse = await users.updateOne(
        { user_id: userId },
        { $set: { password: password, date: date } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update user: ${e}`)
      return { error: e }
    }
  }

  static async deleteUser(userId) {
    try {
      const deleteResponse = await users.deleteOne({
        _id: userId
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete user: ${e}`)
      return { error: e }
    }
  }
}