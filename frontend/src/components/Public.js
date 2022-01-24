import React from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

import chain from './data/blogChain-data';
import users from './data/userChain-data';

class Public extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aside: false,
      recent: null,
      views: null,
      likes: null,
      display: 'half',
      search: true
    };

    this.change = this.change.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.filterChain = this.filterChain.bind(this);
    this.upSearch = this.upSearch.bind(this);
  }

  change() {
    const tl = gsap.timeline({defaults: {ease: this.state.aside ? 'back' : 'expo'}});
    tl.fromTo('.tlSlide', {transform: 'translateX(0)'}, {transform: 'translateX(110%)', duration: this.state.aside ? .75 : .5, onComplete: () => this.setState({aside: !this.state.aside})});
    tl.fromTo('.tlSlide', {transform: 'translateX(110%)'}, {transform: 'translateX(0)', duration: this.state.aside ? .5 : 1});
  }

  keyPress(e) {
    if (e.keyCode === 13) {
      if (e.target.className === 'aside-x' || e.target.className === 'tlSlide') {
        this.change();
      } else if (e.target.className === 'searchTab') {
        this.upSearch(e);
      }
    }
  }

  sortChange(key) {
    const value = this.state[key];
    this.setState({recent: null, views: null, likes: null});
    if (value === null) {
      this.setState({[key]: '+'});
    } else if (value === '+') {
      this.setState({[key]: '-'});
    }
  }

  filterChain(type = '', value = '') {
    if (!type && !value) {
      return chain;
    }
    // eslint-disable-next-line
    const filtered = chain.map((obj, i, arr) => {
      if (arr[i][type] === value) {
        return arr[i];
      }
    });
    return filtered;
  }

  upSearch(e) {
    this.setState({search: e.target.parentNode.id === 'titleTab' ? true : e.target.id === 'titleTab' ? true : false});
  }

  render() {
    const chainMap = this.filterChain();
    const displayChain = chainMap.map((obj, i, arr) => {
      const user = users.filter(obj => obj.id === arr[i].author)[0];
      return (<Link to={"/blog/" + arr[i].id} className="blog" key={i}>
        <h3>{arr[i].title}</h3>
        <div className="bottomMatter">
          <span>{user.username}</span>
          <span className="postCount">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-text" viewBox="0 0 16 16">
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
              <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
            </svg>
            {arr[i].content.length}
          </span>
        </div>
      </Link>);
    });

    const style = {backgroundColor: 'tomato', boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)'};

    return (<section id="public-box">
      {this.state.aside ? (
        <aside id="public-aside" className="tlSlide">
          <div className="aside-x" onClick={this.change} onKeyUp={this.keyPress} tabIndex="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
          <article>
            <span>Search</span>
            <form>
              <section className="radio-btns">
                <div onClick={this.upSearch} onKeyUp={this.keyPress} className="searchTab" id="titleTab" tabIndex="0">
                  <span style={this.state.search ? style : {}}>Title</span>
                </div>
                <div onClick={this.upSearch} onKeyUp={this.keyPress} className="searchTab" id="authorTab" tabIndex="0">
                  <span style={!this.state.search ? style : {}}>Author</span>
                </div>
              </section>
              <input type="text" placeholder={this.state.search ? 'Title' : 'Author'}/>
            </form>
          </article>
        </aside>
      ) : (
        <aside id="public-aside-menu" className="tlSlide" onClick={this.change} onKeyUp={this.keyPress} tabIndex="0">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </aside>
      )}
      <article>
        <h2>Check This Out</h2>
        <Nav sortChange={this.sortChange} recent={this.state.recent} views={this.state.views} likes={this.state.likes} updateDisplay={(d) => this.setState({display: d})} />
        <div id="view" className={`${this.state.display}-view`}>
          {displayChain}
        </div>
      </article>
    </section>);
  }
}

function Nav(props) {
  const expand = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-expand" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
      </svg>);
  const up = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
      </svg>);
  const down = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>);

  return (<nav id="sort-nav">
    <div className="sort-nav-top">
      <span>Sort</span>
      <div className="sort-div">
        <button onClick={() => props.sortChange('recent')}>Recent</button>
        {props.recent === '+' ? up : props.recent === '-' ? down : expand}
      </div>
      <div className="sort-div">
        <button onClick={() => props.sortChange('views')}>Views</button>
        {props.views === '+' ? up : props.views === '-' ? down : expand}
      </div>
      <div className="sort-div">
        <button onClick={() => props.sortChange('likes')}>Likes</button>
        {props.likes === '+' ? up : props.likes === '-' ? down : expand}
      </div>
    </div>
    <div className="sort-nav-bottom">
      <span>Display</span>
      <button onClick={() => props.updateDisplay('full')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-card-heading" viewBox="0 0 16 16">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
          <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/>
        </svg>
      </button>
      <button onClick={() => props.updateDisplay('half')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16">
          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
        </svg>
      </button>
      <button onClick={() => props.updateDisplay('small')} id="smallBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-grid-3x3-gap" viewBox="0 0 16 16">
          <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z"/>
        </svg>
      </button>
    </div>
  </nav>);
}

export default Public;