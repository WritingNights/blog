import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

import BlogDataService from "../services/blog";
import avatar from "./photos/GenAvatar.jpg";

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
        setUser(response.data);

        setBlogs(response.data.blogs[0] ? response.data.blogs.map(obj => {
          return obj;
        }) : (''));
      })
      .catch(e => console.log(e));
  };

  return (<div id="profile">
    <aside className="profile-aside">
      <img src={avatar} alt="avatar" className="avatar"/>
      <span>{user.username}</span>
      <table>
        <tbody>
          <tr>
            <td>User since:</td>
            <td>{moment(user.date).format('MMM Do, YYYY')}</td>
          </tr>
          <tr>
            <td>Total User Views:</td>
            <td>{"nothing"}</td>
          </tr>
        </tbody>
      </table>
    </aside>
    <article className="profile-article">
      <h2>{user.username}'s Blogs</h2>
      <table className="blogSpot">
        <tbody>
          {blogs.map((obj, i) => {
            return <tr key={i}><td><Link to={`/blog/${obj._id}`}>{obj.title}</Link></td></tr>
          })}
        </tbody>
      </table>
        <div className="tableTop">
          <h2>About {user.username}</h2>
          {user.username === props.user.username ? <button onClick={() => alert("This does nothing")}>Edit</button> : ('')}
        </div>
      <table className="profileInfo">
        <tbody>
          <tr>
            <td>Title:</td>
            <td>{"unknown"}</td>
          </tr>
          <tr>
            <td>Location:</td>
            <td>{"unknown"}</td>
          </tr>
          <tr>
            <td>Interests:</td>
            <td>
              <ul>
                <li>{"unknown"}</li>
                <li>{"unknown"}</li>
                <li>{"unknown"}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Intro:</td>
            <td>{"_blank_"}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </div>)
}

export default Profile;