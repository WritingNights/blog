import React from "react";
import { Link } from "react-router-dom";
import BlogDataService from "../services/blog";

import Aside from "./Aside";

class Public extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recent: null,
      views: null,
      likes: null,
      display: 'half',
      search: true,
      filter: '',
      maxWidth: '',
      blogs: {}
    };

    this.ref = React.createRef();

    this.keyPress = this.keyPress.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.filterChain = this.filterChain.bind(this);
    this.upSearch = this.upSearch.bind(this);

    this.blogsList = this.blogsList.bind(this);
    this.find = this.find.bind(this);
  }

  keyPress(e) {
    if (e.keyCode === 13) {
      if (e.target.className === 'searchTab') {
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
      return null;
    }
    // eslint-disable-next-line
    const filtered = null.map((obj, i, arr) => {
      if (arr[i][type] === value) {
        return arr[i];
      }
    });
    return filtered;
  }

  upSearch(e) {
    this.setState({search: e.target.parentNode.id === 'titleTab' ? true : e.target.id === 'titleTab' ? true : false});
  }

  blogsList() {
    BlogDataService.getBlogs()
      .then(response => {
        this.setState({ blogs: response.data });
      })
      .catch(e => console.log(e));
  }

  find(search, filter) {
    const data = search ? 'title' : 'author';
    BlogDataService.find(filter, data)
      .then(response => {
        this.setState({ blogs: response.data });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.setState({maxWidth: this.ref.current.offsetWidth});
    this.blogsList();
  }

  render() {
    const style = {backgroundColor: 'tomato', boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)'};

    const header = (<span>Search</span>);

    const content = (<article className="public-art">
      <form onSubmit={(e) => {e.preventDefault(); this.find(this.state.search, this.state.filter)}}>
        <section className="radio-btns">
          <div onClick={this.upSearch} onKeyUp={this.keyPress} className="searchTab" id="titleTab" tabIndex="0">
            <span style={this.state.search ? style : {}}>Title</span>
          </div>
          <div onClick={this.upSearch} onKeyUp={this.keyPress} className="searchTab" id="authorTab" tabIndex="0">
            <span style={!this.state.search ? style : {}}>Author</span>
          </div>
        </section>
        <input type="text" placeholder={this.state.search ? 'Title' : 'Author'} value={this.state.filter} onChange={e => this.setState({ filter: e.target.value })} className="filterInput"/>
        <input type="submit"/>
      </form>
      <button onClick={() => {this.blogsList(); this.setState({ filter: '' })}}>Reset</button>
    </article>);

    const logo = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>);

    return (<section id="public-box">
      <Aside header={header} content={content} logo={logo} />
      {this.props.user.username ? (
        <article style={{maxWidth: this.state.maxWidth}} id="newBlog">
          <div className="newBlogDiv">
            <h2>Write Something New...</h2>
            <p>
              You've got something brimming on that mind of yours.
              Why not write about it? Start a new blog here...
            </p>
          </div>
          <Link to={'/create/blog'} className="newBlogBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-journal-plus" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
              <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            </svg>
          </Link>
        </article>
      ) : ('')}
      <article ref={this.ref} className="checkOutBlogs">
        <h2>Check This Out</h2>
        <Nav sortChange={this.sortChange} recent={this.state.recent} views={this.state.views} likes={this.state.likes} updateDisplay={(d) => this.setState({display: d})} />
        <div id="view" className={`${this.state.display}-view`}>
          {this.state.blogs.blogs ? this.state.blogs.blogs.map((obj, i) => {
            return (<Link to={"/blog/" + obj._id} className="blog" key={i} style={this.state.display === 'small' ? {aspectRatio: '1/1'} : this.state.display === 'half' ? {aspectRatio: '2/1'} : {aspectRatio: '3/1'}}>
              <h3>{obj.title}</h3>
              <span className="blogDesc">{obj.text}</span>
              <div className="bottomMatter">
                <span>{obj.author}</span>
                <span className="postCount">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-text" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                    <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                  {obj.posts ? obj.posts.length : 0}
                </span>
              </div>
            </Link>);
          }) : ('')}
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