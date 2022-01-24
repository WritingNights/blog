import React from "react";
import { Link, useParams } from "react-router-dom";

import chain from './data/blogChain-data';
import users from './data/userChain-data';
import posts from './data/postChain-data';

const Blog = props => {
  const { id } = useParams();

  const blog = chain.filter(obj => obj.id === Number(id))[0];
  const user = users.filter(obj => obj.id === blog.author)[0];

  const bPosts = blog.content.map((obj, i, arr) => {
    let blogPost = posts.filter(obj => obj.id === arr[i])[0];
    return (<div className="post-container" key={i}>
      <Link to={'/post/' + arr[i]} className="post-link">
        {blogPost.title}
      </Link>
      {i < blog.content.length - 1 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
      </svg>) : ('')}
    </div>)
  })
  return (<article id="blog-home">
    <span>
      <h1>{blog.title}</h1>
      <Link to={'/profile/' + blog.author} className="authorLink">{user.username}</Link>
    </span>
    <div>
      <section>
        {bPosts}
      </section>
    </div>
  </article>);
}

export default Blog;