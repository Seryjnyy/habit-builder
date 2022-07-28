import AddDocModal from "./AddDocModal";
import TaskManager from "./Components/Task/TaskManager";
import {Box, createTheme} from "@mui/material";
import Login from "./Components/Auth/Login";
import {UserAuthContext} from "./Components/Auth/UserAuthContext"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RequireAuth from "./Components/Auth/RequireAuth";
import Navbar from "./Components/Navigation/Navbar";
import LandingPage from "./Pages/LandingPage";
import RoutinePage from "./Pages/RoutinePage";

function App() {
  return (
    <UserAuthContext>
        <BrowserRouter>
            <Navbar></Navbar>
            <Box sx={{mt:7}}>
                <Routes>
                    <Route path={"/"} element={<LandingPage></LandingPage>}></Route>
                    <Route path={"/login"} element={<Login></Login>}></Route>
                    <Route path={"/routine"} element={<RoutinePage></RoutinePage>}></Route>

                    <Route path={"/task-manager"} element={<RequireAuth redirectTo={"/login"}><TaskManager></TaskManager></RequireAuth>}></Route>

                </Routes>
            </Box>
        </BrowserRouter>
    </UserAuthContext>
  );
}

export default App;
