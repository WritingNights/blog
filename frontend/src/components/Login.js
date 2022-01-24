import React from "react";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            name: '',
            pass: '',
            setVal: 0
        }
    }

    componentDidMount() {
        this.setState({setVal: this.ref.current.offsetHeight});
    }

    render() {
        const style= {height: `${this.state.setVal}px`, width: `${this.state.setVal}px`};
        return (<section id="login" className="topBar">
            <form className="login-form" onSubmit={(e) => {e.preventDefault(); this.props.updateLog(this.state.name, this.state.pass)}}>
                <input type="text" name="name" placeholder="Username" autoComplete="off" ref={this.ref} value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} required/>
                <input type="password" name="pass" placeholder="Password" value={this.state.pass} onChange={(e) => this.setState({pass: e.target.value})} required/>
                <label style={style}>
                    <input type="submit" style={style} value=""/>
                    <svg xmlns="http://www.w3.org/2000/svg" width={`${this.state.setVal}px`} height={`${this.state.setVal}px`} fill="currentColor" viewBox="0 0 480.358 480.358" id="loginCheck">
                        <path d="M387.702 43.753L181.316 253.467l-90.84-88.044L0 258.771l183.479 177.834l296.879-301.667L387.702 43.753zM182.98 394.343L42.421 258.108l48.719-50.265l90.676 87.886L388.042 86.178l49.892 49.1L182.98 394.343z"/>
                    </svg>
                </label>
            </form>
        </section>);
    }
}

export default Login;