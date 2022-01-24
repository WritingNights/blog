import React from "react";
import { useParams } from "react-router";

import users from './data/userChain-data';

const Profile = props => {
    const { id } = useParams();

    const profile = users.filter(obj => obj.id === Number(id))[0];

    return (<div>
        {profile.username}
    </div>)
}

export default Profile;