import http from "../http-common";

class BlogDataService {
  getBlogs(page = 0) {
    return http.get(`?page=${page}`);
  }

  find(query, by = "title", page = 0) {
    return http.get(`?${by}=${query}&page=${page}`);
  }

  getUser(username) {
    return http.get(`/user/${username}`);
  }

  getProfile(username) {
    return http.get(`/profile/${username}`);
  }

  getUserById(id) {
    return http.get(`/user/id/${id}`);
  }

  getBlogById(id, data) {
    return http.get(`/blog/id/${id}`, data);
  }

  getPostById(id, data) {
    return http.get(`/post/id/${id}`, data);
  }

  createUser(data) {
    return http.post("/user", data);
  }

  updateUser(data) {
    return http.put("/user", data);
  }

  deleteUser(userId) {
    return http.delete(`/user`, { data: { user_id: userId} });
  }

  createBlog(data) {
    return http.post("/blog", data);
  }

  updateBlog(data) {
    return http.put("/blog", data);
  }

  deleteBlog(id, userId) {
    return http.delete(`/blog?id=${id}`, { data: { user_id: userId } });
  }

  createPost(data) {
    return http.post("/post", data);
  }

  updatePost(data) {
    return http.put("/post", data);
  }

  deletePost(id, userId) {
    return http.delete(`/post?id=${id}`, { data: { user_id: userId } });
  }
}

export default new BlogDataService();