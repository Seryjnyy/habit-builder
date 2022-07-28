import React from 'react';
import {AppBar, Button, Container, Toolbar, Typography} from "@mui/material";
import {useAuth} from "../Auth/UserAuthContext";
import {useNavigate} from "react-router-dom";

function Navbar(props) {
    const tempColour = "#01031d";

    const {user, login, logout} = useAuth();
    let navigate = useNavigate();


    const Logout = () => {
        logout();
    }

    const LoginWithGoogle = () => {
        login()
            .then((result) => {
                // The signed-in user info.
                const user = result.user;

                //redirect user
                navigate("/task-manager");
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    };

    return (
       <AppBar position="fixed" sx={{backgroundColor: tempColour}}>
           <Container maxWidth="xl">
                <Toolbar sx={{alignContent: "end", minWidth:"100%"}} >
                    <Typography sx={{ flexGrow: 1 }}>something</Typography>
                    {user ? <><Typography>{"Hi, " + user.displayName}</Typography><Button onClick={() => Logout()}>Logout</Button></>: <Button onClick={() => LoginWithGoogle()}>Login with Google</Button>}
                </Toolbar>
           </Container>
       </AppBar>
    );
}

export default Navbar;