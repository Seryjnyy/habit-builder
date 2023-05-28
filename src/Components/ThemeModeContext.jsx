import React, {createContext, useContext, useEffect, useState} from 'react';
import {useMediaQuery} from "@mui/material";

const ThemeContext = createContext(null);

export function ThemeModeContext({children}){
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

    return (
        <ThemeContext.Provider value={{mode, setMode}}>{children}</ThemeContext.Provider>
    );
}

export function useThemeMode(){
    return useContext(ThemeContext);
}

