import React from 'react';
import useAuth from "../../hooks/useAuth";
import {Navigate, Outlet} from "react-router-dom";
import {LINK_LOGIN} from "../../tools/const";
import Loader from "../Notification/Loader";

const AuthGuard = ({children}) => {
    const {auth} = useAuth()

    if(!auth)
        return <Loader />
    if(!auth.isAuth)
        return <Navigate to={LINK_LOGIN} replace />;

    return children || <Outlet/>;
};

export default AuthGuard;