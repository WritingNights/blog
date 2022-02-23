import React from "react";

import gsap from "gsap";

class Aside extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aside: false
    };

    this.change = this.change.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  change() {
    const tl = gsap.timeline({defaults: {ease: this.state.aside ? 'back' : 'expo'}});
    tl.fromTo('.tlSlide', {
        transform: 'translateX(0)'
    }, {
        transform: 'translateX(120%)', duration: this.state.aside ? .75 : .5, onComplete: () => this.setState({aside: !this.state.aside})
    });
    tl.fromTo('.tlSlide', {
        transform: 'translateX(120%)'
    }, {
        transform: 'translateX(0)', duration: this.state.aside ? .5 : 1
    });
  }

  keyPress(e) {
    if (e.keyCode === 13) {
      if (e.target.className === 'aside-x' || e.target.className === 'tlSlide') {
        this.change();
      }
    }
  }

  render() {
    return (this.state.aside ? (<aside id="public-aside" className="tlSlide">
      <header>
        {this.props.header}
        <div className="aside-x" onClick={this.change} onKeyUp={this.keyPress} tabIndex="0">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      </header>
      {this.props.content}
    </aside>) : (<aside id="public-aside-menu" className="tlSlide" onClick={this.change} onKeyUp={this.keyPress} tabIndex="0">
      {this.props.logo}
    </aside>)
    );
  }
}

export default Aside;