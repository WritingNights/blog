import React from 'react';
import './App.css';
import gsap from "gsap";
import { Routes, Route } from "react-router-dom";

import Login from './components/Login';
import Navbar from './components/Navbar';
import Public from './components/Public';
import Blog from './components/Blog';
import Post from './components/Post';
import Profile from './components/Profile';

import users from './components/data/userChain-data';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: {
        username: 'you',
        id: 0
      }
    }

    this.updateLog = this.updateLog.bind(this);
    this.anim = this.anim.bind(this);
  }

  updateLog(name, pass = '') {
    const update = name ? name : '';
    const id = pass ? pass : '';
    const user = users.filter(obj => obj.username === name && obj.id === Number(pass))[0]
    if (user || name === '') {
      const log = gsap.timeline({defaults: {duration: .5, ease: 'power3.out'}});
      log.fromTo('.topBar', {transform: 'translateY(0)', opacity: 1}, {transform: 'translateY(-110%)', opacity: .25, onComplete: () => {this.setState({ loggedIn: { username: update, id: id } }); this.anim(log)}});
    }
  }

  anim(log) {
    log.fromTo('.topBar', {transform: 'translateY(-110%)', opacity: .25}, {transform: 'translateY(0)', opacity: 1});
  }

  render() {
    return (<main>
      {!this.state.loggedIn.username ? (
        <Login updateLog={this.updateLog} />
      ) : (
        <Navbar user={this.state.loggedIn} logout={this.updateLog} />
      )}
      <Routes>
        <Route path={"/"} element={<Public />} />
        <Route path={"/blog/:id"} element={<Blog user={this.state.loggedIn} />} />
        <Route path={"/post/:id"} element={<Post user={this.state.loggedIn} />} />
        <Route path={"/profile/:id"} element={<Profile user={this.state.loggedIn} />} />
      </Routes>
    </main>);
  }
}

export default App;