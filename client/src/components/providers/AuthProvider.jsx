import React, {useEffect, useState} from 'react';
import {AuthContext} from "../../context/contexts";
import API from "../../tools/Services/API";

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null)

    const login = (username, password) => {
        return API.login(username, password).then(data => {
            console.log({login: data})
            if(!data?.accessToken)
                return false
            setAuth({token: data.accessToken, isAuth: true})
            return true
        })
    }
    const register = (username, password) => {
        return API.register(username, password).then(data => {
            console.log({register: data})
            if(!data?.accessToken)
                return false
            setAuth({token: data.accessToken, isAuth: true})
            return true
        })
    }

    const checkAuth = () => {
        return API.getMe().then(data => {
            console.log({me: data})
            if(!data?.user){
                setAuth(prev => ({...prev, isAuth:false}))
                return
            }
            setAuth(prev => ({...prev, isAuth:true, user: data}))
        })
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth, login, register, checkAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;