import UsersDAO from "../dao/usersDAO.js"

export default class UsersController {
  static async apiGetUsers(req, res, next) {
    const username = req.params.username

    const { userList, totalUsers } = await UsersDAO.getUsers(username)

    let response = {
      users: userList,
      total_results: totalUsers
    }
    res.json(response)
  }

  static async apiGetProfile(req, res, next) {
    try {
      const username = req.params.username

      const profile = await UsersDAO.getProfile(username)
      if (!profile) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(profile)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetUserById(req, res, next) {
    try {
      let id = req.params.id || {}
      let user = await UsersDAO.getUserById(id)
      if (!user) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(user)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostUser(req, res, next) {
    try {
      const username = req.body.name
      const password = req.body.pass
      const date = new Date()

      const exists = await UsersDAO.getUsers(username)
      console.log(exists)

      if (exists.userList[0]) {
        console.log("User already exists")
      } else {
        const UserResponse = await UsersDAO.addUser(
          username,
          password,
          date
        )
      }
      res.json(UserResponse)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateUser(req, res, next) {
    try {
      const userId = req.body.user_idx
      const password = req.body.password
      const date = new Date()

      const userResponse = await UsersDAO.updateUser(
        userId,
        password,
        date
      )

      let { error } = userResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (userResponse.modifiedCount === 0) {
        throw new Error("Unable to update blog - user many not be original poster")
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteUser(req, res, next) {
    try {
      const userId = req.query.id
      const userResponse = await UsersDAO.deleteUser(userId)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}