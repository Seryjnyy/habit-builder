import React from "react";
import { useAuth } from "./UserAuthContext";
import { Button } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";


// should have the redirect version for mobile users

function Login(props) {
  const userAuth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();

  const redirectPath = location.state?.path || '/';

  const Logout = () => {
      userAuth.logout();
  }

  const LoginWithGoogle = () => {
    userAuth
      .login()
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        navigate(redirectPath, {replace:true});
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <>
      <Button onClick={() => LoginWithGoogle()}>Login with Google</Button>
        <Button onClick={() => Logout()}>Logout</Button>
      {/*<div>{ auth?.currentUser?.displayName}</div>*/}
    </>
  );
}

export default Login;
