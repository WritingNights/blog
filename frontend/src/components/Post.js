import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import BlogDataService from "../services/blog";

const Post = props => {
  const { id } = useParams();

  const initialPostState = {
    name: '',
    user_id: '',
    title: '',
    text: '',
    blog_id: ''
  };

  const [ post, setPost ] = useState(initialPostState);

  useEffect(() => {
    updatePost();
    return () => {
      setPost({initialPostState});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePost = () => {
    BlogDataService.getPostById(id)
      .then(response => {
        console.log(response.data);
        setPost(response.data);
      })
      .catch(e => console.log(e));
  };

  return (<div id="post-page">
    <div className="topper">
      <span>{post.title} from <Link to={'/blog/' + post.blog_id}>this blog</Link></span>
      {props.user._id === post.user_id ? <Link to={`/edit/post/${id}`}>Edit</Link> : ''}
    </div>
    <header>
      <h1>{post.title}</h1>
      <h3><Link to={`/profile/${post.name}`}>{post.name}</Link></h3>
    </header>
    <ReactMarkdown children={`${post.text}`} />
  </div>);
}

export default Post;