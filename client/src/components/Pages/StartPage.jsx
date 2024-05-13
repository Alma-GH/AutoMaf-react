import React from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {useNavigate} from "react-router-dom";
import {LINK_CREATE, LINK_ENTER, LINK_FIND, LINK_LOGIN, LINK_STAT} from "../../tools/const";
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../../hooks/useAuth";

const StartPage = () => {
    const {logout, auth} = useAuth()
    const nav = useNavigate()


    function getNav(link) {
        return () => nav(link)
    }

    return (
        <div className="startPage">
            <div className="btnCont">
                <BtnText text="Найти" cb={getNav(LINK_FIND)}/>
                <BtnText text="Создать" cb={getNav(LINK_CREATE)}/>
                {auth?.isAuth && <BtnText text="Статистика" cb={getNav(LINK_STAT)}/>}
                <BtnText text="Имя" color="yellow" cb={getNav(LINK_ENTER)}/>
                {auth?.isAuth
                  ? (<BtnText text="Выйти" color="red" cb={logout}/>)
                  : (<BtnText text="Войти" color="yellow" cb={getNav("../" + LINK_LOGIN)}/>)
                }
            </div>
        </div>

    );
};

export default StartPage;