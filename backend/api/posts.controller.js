import PostsDAO from "../dao/postsDAO.js"

export default class PostsController {
  static async apiGetPostById(req, res, next) {
    try {
      let id = req.params.id || {}
      const edit = req.body.edit
      let post = await PostsDAO.getPostByID(id, edit ? edit : '')
      if (!post) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(post)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostPost(req, res, next) {
    try {
      const blogId = req.body.blog_id
      const title = req.body.title
      const post = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      const PostResponse = await PostsDAO.addPost(
        blogId,
        userInfo,
        title,
        post,
        date
      )
      res.json(PostResponse)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdatePost(req, res, next) {
    try {
      const postId = req.body.post_id
      const title = req.body.title
      const text = req.body.text
      const date = new Date()

      const postResponse = await PostsDAO.updatePost(
        postId,
        req.body.user_id,
        title,
        text,
        date
      )

      let { error } = postResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (postResponse.modifiedCount === 0) {
        throw new Error("Unable to update post - user many not be original poster")
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeletePost(req, res, next) {
    try {
      const postId = req.query.id
      const userId = req.body.user_id
      const postResponse = await PostsDAO.deletePost(
        postId,
        userId
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}