import {createContext} from "react";


export const RoomContext = createContext(null)
export const MessageContext = createContext(null)
export const SettingsContext = createContext(null)
export const ServerTimerContext = createContext(null)
export const CardContext = createContext(null)
export const AuthContext = createContext({
    auth: {
        token: "",
        isAuth: false,
        user: null,
    },
    setAuth: ()=>{},
    login: ()=>{},
    register: ()=>{},
    checkAuth: ()=>{},
    logout: ()=>{}
})