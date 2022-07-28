import React, {createContext, useContext, useEffect, useState} from 'react';
import {signInWithPopup, signOut, onAuthStateChanged} from "firebase/auth"
import {auth, provider} from "../../firebase"

const AuthContext = createContext(null);

export function UserAuthContext({children}) {
    const [user, setUser] = useState({});

    const login = async () => {
        return await signInWithPopup(auth, provider);
    }

    const logout = async () => {
        return await signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // return a function that will call unsubscribe
        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, user}}> {children} </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}
