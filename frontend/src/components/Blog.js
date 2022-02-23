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
        }) : ([]))
      })
      .catch(e => console.log(e));
  };

  const content = (<article>
    Comments
  </article>);

  const logo = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chat-text" viewBox="0 0 18 18">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                  <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                </svg>);

  const bookmark = props.user.bookmarks ? props.user.bookmarks.b.filter(obj => obj === Number(id))[0] : null;

  return (<article id="blog-home">
    <Aside content={content} logo={logo} />
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