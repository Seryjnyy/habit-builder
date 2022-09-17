import AddDocModal from "./Components/AddDocModal";
import TaskManager from "./Components/Task/TaskManager";
import {Box, createTheme, CssBaseline, IconButton, ThemeProvider} from "@mui/material";
import Login from "./Components/Auth/Login";
import {UserAuthContext} from "./Components/Auth/UserAuthContext"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RequireAuth from "./Components/Auth/RequireAuth";
import Navbar from "./Components/Navigation/Navbar";
import LandingPage from "./Pages/LandingPage";
import RoutinePage from "./Pages/RoutinePage";
import ProfilePage from "./Pages/ProfilePage";
import {green} from "@mui/material/colors";
import {useThemeMode} from "./Components/ThemeModeContext";

function App() {
    let {mode} = useThemeMode();

    const theme = createTheme({
        spacing: 8,
        palette:{
            mode: mode,
            customGreen : {
                main: green[300],
                dark: green[800],
                light: green[200]
            }
        }
    })

    console.log(theme.palette)
  return (
    <UserAuthContext>
        <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Box sx={{overflowX:"hidden"}}>
                        <Navbar></Navbar>
                        <Box sx={{mt:10}}>
                            {theme.palette.mode} mode
                            <Routes>
                                <Route path={"/"} element={<LandingPage></LandingPage>}></Route>
                                <Route path={"/login"} element={<Login></Login>}></Route>
                                <Route path={"/routines"} element={<RequireAuth redirectTo={"/login"}><RoutinePage></RoutinePage></RequireAuth>}></Route>

                                <Route path={"/tasks"} element={<RequireAuth redirectTo={"/login"}><TaskManager></TaskManager></RequireAuth>}></Route>
                                <Route path={"/profile"} element={<RequireAuth redirectTo={"/login"}><ProfilePage></ProfilePage></RequireAuth>}></Route>

                            </Routes>
                        </Box>
                    </Box>
                </ThemeProvider>
        </BrowserRouter>
    </UserAuthContext>
  );
}

export default App;
