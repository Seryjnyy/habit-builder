import React from 'react';
import {useAuth} from "./UserAuthContext";
import {Navigate, useLocation} from "react-router-dom";

function RequireAuth({children, redirectTo}) {
    const {user} = useAuth();
    const location = useLocation();

    return user ? children : <Navigate to={redirectTo} state={{path: location.pathname}}/>
}

export default RequireAuth;