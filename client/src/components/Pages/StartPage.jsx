import React from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {useNavigate} from "react-router-dom";
import {EM_VERSION, LINK_CREATE, LINK_ENTER, LINK_FIND, LINK_STAT, T_VERSION} from "../../tools/const";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../../hooks/useAuth";

const StartPage = () => {
    const {logout} = useAuth()
    const nav = useNavigate()


    function getNav(link) {
        return () => nav(link)
    }

    return (
        <div className="startPage">
            <div className="btnCont">
                <BtnText text="Найти" cb={getNav(LINK_FIND)}/>
                <BtnText text="Создать" cb={getNav(LINK_CREATE)}/>
                <BtnText text="Статистика" cb={getNav(LINK_STAT)}/>
                <BtnText text="Имя" color="yellow" cb={getNav(LINK_ENTER)}/>
                <BtnText text="Выйти" color="red" cb={logout}/>
            </div>
        </div>

    );
};

export default StartPage;