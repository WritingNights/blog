import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BlogDataService from "../services/blog";

import Aside from './Aside';

const Blog = props => {
  const { id } = useParams();

  const initialBlogState = {
    author: '',
    user_id: '',
    title: '',
    content: '',
    posts: []
  };

  const [ blog, setBlog ] = useState(initialBlogState);
  const [ posts, setPosts ] = useState([]);

  useEffect(() => {
    updateBlog();
    return () => {
      setBlog({initialBlogState});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBlog = () => {
    BlogDataService.getBlogById(id)
      .then(response => {
        console.log(response.data);
        setBlog(response.data);

        setPosts(response.data.posts[0] ? response.data.posts.map((obj, i) => {
          return (<div className="post-container" key={i}>
            {i > 0 ? (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>) : ('')}
            <Link to={`/post/${obj._id}`} className="post-link">
              <span>{obj.title}</span>
              <p>{obj.text}</p>
            </Link>
          </div>)
          }) : (<div className="post-container">
            No posts yet
          </div>))
      })
      .catch(e => console.log(e));
  };

  const bookmark = props.user.bookmarks ? props.user.bookmarks.b.filter(obj => obj === Number(id))[0] : null;

  return (<article id="blog-home">
    <span>
      <h1>
        {blog.title} {props.user._id !== blog.user_id ? bookmark ? (<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-journal-bookmark-fill" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z"/>
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
        </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-journal-bookmark" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
        </svg>) : ('')}
      </h1>
      <Link to={'/profile/' + blog.author} className="authorLink">{blog.author}</Link>
    </span>
    <div>
      <section>
        {posts}
        {blog.user_id === props.user._id ? (
          <div className="post-container">
            {blog.posts ? blog.posts.length > 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
              ) : ('') : ('')
            }
            <Link to={`/create/post/${id}`} className="post-link">
              Add Post
            </Link>
          </div>
        ) : ('')}
      </section>
    </div>
  </article>);
}

export default Blog;