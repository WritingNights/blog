import express from "express"
import BlogsCtrl from "./blogs.controller.js"
import PostsCtrl from "./posts.controller.js"
import UsersCtrl from "./users.controller.js"

const router = express.Router()

router.route("/").get(BlogsCtrl.apiGetBlogs)

router
  .route("/blog")
  .post(BlogsCtrl.apiPostBlog)
  .put(BlogsCtrl.apiUpdateBlog)
  .delete(BlogsCtrl.apiDeleteBlog)

router.route("/blog/id/:id").get(BlogsCtrl.apiGetBlogById)

router
  .route("/post")
  .post(PostsCtrl.apiPostPost)
  .put(PostsCtrl.apiUpdatePost)
  .delete(PostsCtrl.apiDeletePost)

router.route("/post/id/:id").get(PostsCtrl.apiGetPostById)

router
  .route("/user")
  .post(UsersCtrl.apiPostUser)
  .put(UsersCtrl.apiUpdateUser)
  .delete(UsersCtrl.apiDeleteUser)

router.route("/user/:username").get(UsersCtrl.apiGetUsers)
router.route("/profile/:username").get(UsersCtrl.apiGetProfile)

export default router