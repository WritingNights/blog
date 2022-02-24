import React from 'react';
import './App.css';
import gsap from "gsap";
import { Routes, Route } from "react-router-dom";

import BlogDataService from "./services/blog";

import Login from './components/Login';
import Navbar from './components/Navbar';
import Public from './components/Public';
import Blog from './components/Blog';
import Post from './components/Post';
import Profile from './components/Profile';
import Create from './components/Create';

class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      loggedIn: {},
      blogs: []
    }

    this.updateLog = this.updateLog.bind(this);
    this.anim = this.anim.bind(this);
  }

  updateLog(name, pass, create) {
    console.log(name, create);
    if (create) {
      BlogDataService.createUser({name, pass})
      .then(response => {
        this.setState({ loggedIn: response.data.users[0] });
      })
      .catch(e => console.log(e));
    } else {
      const log = gsap.timeline({defaults: {duration: .5, ease: 'power3.out'}});
      log.fromTo('.topBar', {transform: 'translateY(0)', opacity: 1}, {transform: 'translateY(-110%)', opacity: .25, onComplete: () => {
        if (name) {
          BlogDataService.getUser(name)
            .then(response => {
              this.setState({ loggedIn: response.data.users[0] });
              localStorage.setItem('username', response.data.users[0].username);
              localStorage.setItem('id', response.data.users[0]._id);
            })
            .catch(e => console.log(e));
        } else {
          this.setState({ loggedIn: '' });
          localStorage.clear();
        }
        this.anim(log);
      }});
    }
  }

  anim(log) {
    log.fromTo('.topBar', {transform: 'translateY(-110%)', opacity: .25}, {transform: 'translateY(0)', opacity: 1});
  }

  componentDidMount() {
    this.setState({ loggedIn: localStorage.getItem('username') ? { username: localStorage.getItem('username'), _id: localStorage.getItem('id') } : { username: '', _id: '' } })
  }

  render() {
    return (<main>
      {!this.state.loggedIn.username ? (
        <Login updateLog={this.updateLog} />
      ) : (
        <Navbar user={this.state.loggedIn} logout={this.updateLog} />
      )}
      <Routes>
        <Route path={"/"} element={<Public user={this.state.loggedIn} />} />
        <Route path={"/blog/:id"} element={<Blog user={this.state.loggedIn} />} />
        <Route path={"/post/:id"} element={<Post user={this.state.loggedIn} />} />
        <Route path={"/profile/:username"} element={<Profile user={this.state.loggedIn} />} />
        <Route path={"/create/:type"} element={<Create user={this.state.loggedIn} />} />
        <Route path={"/create/:type/:id"} element={<Create user={this.state.loggedIn} />} />
        <Route path={"/edit/:type/:id"} element={<Create user={this.state.loggedIn} edit={true} />} />
      </Routes>
    </main>);
  }
}

export default App;