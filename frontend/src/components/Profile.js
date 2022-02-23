import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import BlogDataService from "../services/blog";

const Profile = props => {
  const { username } = useParams();

  const initialUserState = {
    username: '',
    _id: ''
  }

  const [ user, setUser ] = useState(initialUserState);
  const [ blogs, setBlogs ] = useState([]);

  useEffect(() => {
    updateProfile();
    return () => {
      setUser({initialUserState});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = () => {
    BlogDataService.getProfile(username)
      .then(response => {
        console.log(response.data);
        setUser(response.data);

        setBlogs(response.data.blogs[0] ? response.data.blogs.map(obj => {
          return obj;
        }) : (''));
      })
      .catch(e => console.log(e));
  };

  return (<div id="profile">
    <aside className="profile-aside">
      {user.username}
    </aside>
    <article className="profile-article">
      {blogs.map(obj => {
        return <Link to={`/blog/${obj._id}`}>{obj.title}</Link>
      })}
    </article>
  </div>)
}

export default Profile;