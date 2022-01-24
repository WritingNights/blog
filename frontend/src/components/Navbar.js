import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
    return (<nav id="navbar" className="topBar">
        <div>
            <Link to={"/"}>Blog Main</Link>
        </div>
        <div className="loggedBlock">
            <span>{props.user.username}</span>
            <button onClick={() => props.logout('')}>Logout</button>
        </div>
    </nav>);
}