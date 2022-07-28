import React from 'react';
import {useAuth} from "./UserAuthContext";
import {Navigate} from "react-router-dom";

function RequireAuth({children, redirectTo}) {
    const {user} = useAuth();

    return user ? children : <Navigate to={redirectTo}/>
}

export default RequireAuth;