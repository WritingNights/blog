import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import BlogsDAO from "./dao/blogsDAO.js"
import PostsDAO from "./dao/postsDAO.js"
import UsersDAO from "./dao/usersDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.RESTBLOG_DB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500
  }
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await BlogsDAO.injectDB(client)
    await PostsDAO.injectDB(client)
    await UsersDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })