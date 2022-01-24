import React from "react";
import { useParams } from "react-router";

import posts from './data/postChain-data';

const Post = props => {
    const { id } = useParams();

    const post = posts.filter(obj => obj.id === Number(id))[0];

    return (<div>
        {post.title}
    </div>)
}

export default Post;