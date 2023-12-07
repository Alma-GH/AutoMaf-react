import React, {useEffect, useState} from 'react';
import {AuthContext} from "../../context/contexts";
import API from "../../tools/Services/API";
import {S_ACCESS_TOKEN} from "../../tools/const";
import Socket from "../../tools/Services/Socket";

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null)

    const setAuthAndToken = (json) => {
        const token = json?.accessToken
        if(!token)
            return
        localStorage.setItem(S_ACCESS_TOKEN, token)
        setAuth({token, isAuth: true})
    }

    const login = async (username, password) => {
        const res = await API.login(username, password)
        if(!res)
            return res

        const data = await res.json()
        setAuthAndToken(data)
        return {...data, status: res.status}
    }
    const register = async (username, password) => {
        const res = await API.register(username, password)
        if(!res)
            return res

        const data = await res.json()
        setAuthAndToken(data)
        return {...data, status: res.status}
    }

    const logout = () => {
        setAuth({ isAuth: false })
        Socket.close()
        localStorage.removeItem(S_ACCESS_TOKEN)
    }

    const checkAuth = async () => {
        const res = await API.getMe()
        if(!res)
            return res

        const data = await res.json()
        console.log({me: data})
        if(!data?.user){
            setAuth(prev => ({...prev, isAuth:false}))
            return {...data, status: res.status}
        }
        setAuth(prev => ({...prev, isAuth:true, user: data}))
        return {...data, status: res.status}
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth, login, logout, register, checkAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;