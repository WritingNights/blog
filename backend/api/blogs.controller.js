import BlogsDAO from "../dao/blogsDAO.js"

export default class BlogsController {
  static async apiGetBlogs(req, res, next) {
    const blogsPerPage = req.blogsPerPage ? parseInt(req.query.blogsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.title) {
      filters.title = req.query.title
    } else if (req.query.author) {
      filters.author = req.query.author
    }

    const { blogList, totalBlogs } = await BlogsDAO.getBlogs({
      filters,
      page,
      blogsPerPage
    })

    let response = {
      blogs: blogList,
      page: page,
      filters: filters,
      entries_per_page: blogsPerPage,
      total_results: totalBlogs
    }
    res.json(response)
  }

  static async apiGetBlogById(req, res, next) {
    try {
      let id = req.params.id || {}
      const edit = req.body.edit
      let blog = await BlogsDAO.getBlogByID(id, edit ? edit : '')
      if (!blog) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(blog)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostBlog(req, res, next) {
    try {
      const title = req.body.title
      const blog = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      const BlogResponse = await BlogsDAO.addBlog(
        title,
        blog,
        userInfo,
        date
      )
      res.json(BlogResponse)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateBlog(req, res, next) {
    try {
      const blogId = req.body.blog_id
      const title = req.body.title
      const text = req.body.text
      const date = new Date()

      const blogResponse = await BlogsDAO.updateBlog(
        blogId,
        req.body.user_id,
        title,
        text,
        date
      )

      let { error } = blogResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (blogResponse.modifiedCount === 0) {
        throw new Error("Unable to update blog - user many not be original poster")
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteBlog(req, res, next) {
    try {
      const blogId = req.query.id
      const userId = req.body.user_id
      const blogResponse = await BlogsDAO.deleteBlog(
        blogId,
        userId
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}