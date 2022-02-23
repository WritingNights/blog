import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import BlogDataService from "../services/blog";

const Create = props => {
  const { type, id } = useParams();

  const [ state, setState] = useState({ title: '', content: '' });
  const [ author, setAuthor ] = useState({ author: '', user_id: '' });

  useEffect(() => {
    if (props.edit && type === 'blog') {
      retrieveEditBlog();
    } else if (props.edit && type === 'post') {
      retrieveEditPost();
    }
    return () => {
      setState({ title: '', content: '' });
      setAuthor({ author: '', user_id: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveEditBlog = () => {
    BlogDataService.getBlogById(id, { edit: true })
      .then(response => {
        console.log(response.data);
        setState({
          title: response.data.title,
          content: response.data.text
        });
        setAuthor({
          author: response.data.author,
          user_id: response.data.user_id
        });
      })
      .catch(e => {
        console.log(e);
      });
    };

  const retrieveEditPost = () => {
    BlogDataService.getPostById(id, { edit: true })
      .then(response => {
        console.log(response.data);
        setState({
          title: response.data.title,
          content: response.data.text
        });
        setAuthor({
          author: response.data.name,
          user_id: response.data.user_id
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const formSubmit = () => {
    console.log(state.title, state.content);
    let data = {
      title: state.title,
      text: state.content,
      name: props.user.username,
      user_id: props.user._id
    };
    if (props.edit) {
      if (type === 'blog') {
        data.blog_id = id;
        BlogDataService.updateBlog(data);
        window.location.replace(`/blog/${id}`);
      } else {
        data.post_id = id;
        BlogDataService.updatePost(data);
        window.location.replace(`/post/${id}`);
      }
    } else {
      if (type === 'blog') {
        BlogDataService.createBlog(data)
          .then(response => {
            window.location.replace(`/blog/${response.data.insertedId}`);
          })
      } else {
        data.blog_id = id;
        BlogDataService.createPost(data)
          .then(response => {
            window.location.replace(`/post/${response.data.insertedId}`);
          })
      }
    }
  };

  if (props.edit && author.user_id !== props.user._id) {
    return (
      <section>
        Cannot edit this content.
      </section>
    );
  } else {
    if (props.user.username) {
      return (
        <section id="create">
          {props.edit ? 'Edit' : 'Create a new'} {type}
          <form onSubmit={e => {e.preventDefault(); formSubmit()}}>
            <input className="createTitle" type="text" placeholder="Title" value={state.title} onChange={e => setState({ title: e.target.value, content: state.content })} required/>
            <label>
              by <input type="text" name="user" value={props.user.username} className="createUser" disabled required/>
            </label>
            <textarea placeholder={type === "blog" ? "Description" : "Markown here..."} rows={type === "blog" ? 5 : 20} value={state.content} onChange={e => setState({ title: state.title, content: e.target.value })}/>
            <input type="submit" value={props.edit ? 'Update' : 'Create'}/>
          </form>
        </section>
      );
    } else {
      return (
        <section>
          Log in to create content.
        </section>
      );
    }
  }
};

export default Create;