import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";

import chain from './data/blogChain-data';
import users from './data/userChain-data';
import posts from './data/postChain-data';

const Blog = props => {
    const [ aside, setAside ] = useState(false);

  const { id } = useParams();

  const blog = chain.filter(obj => obj.id === Number(id))[0];
  const user = users.filter(obj => obj.id === blog.author)[0];

  const bPosts = blog.content.map((obj, i, arr) => {
    let blogPost = posts.filter(obj => obj.id === arr[i])[0];
    return (<div className="post-container" key={i}>
      {i > 0 ? (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
      </svg>) : ('')}
      <Link to={'/post/' + arr[i]} className="post-link">
        <span>{blogPost.title}</span>
        <p>{blogPost.description}</p>
      </Link>
    </div>)
  })

  const change = () => {
    const tl = gsap.timeline({defaults: {ease: aside ? 'back' : 'expo'}});
    tl.fromTo('.tlSlide', {transform: 'translateX(0)'}, {transform: 'translateX(110%)', duration: aside ? .75 : .5, onComplete: () => setAside(!aside)});
    tl.fromTo('.tlSlide', {transform: 'translateX(110%)'}, {transform: 'translateX(0)', duration: aside ? .5 : 1});
  }

  const keyPress = e => {
    if (e.keyCode === 13) {
      if (e.target.className === 'aside-x' || e.target.className === 'tlSlide') {
        change();
      }
    }
  }

  return (<article id="blog-home">
    {aside ? (
      <aside id="public-aside" className="tlSlide">
        <div className="aside-x" onClick={change} onKeyUp={keyPress} tabIndex="0">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
        <article>
            Comments
        </article>
      </aside>
    ) : (
      <aside id="public-aside-menu" className="tlSlide" onClick={change} onKeyUp={keyPress} tabIndex="0">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chat-text" viewBox="0 0 18 18">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
          <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </aside>
    )}
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