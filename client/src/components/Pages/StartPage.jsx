import React from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {useNavigate} from "react-router-dom";
import {EM_VERSION, LINK_CREATE, LINK_ENTER, LINK_FIND, T_VERSION} from "../../tools/const";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const StartPage = () => {
    const nav = useNavigate()


    function getNav(link) {
        return () => nav(link)
    }

    function throwMessage() {
        toast(EM_VERSION, {toastId: T_VERSION})
    }

    return (
        <div className="startPage">
            <div className="btnCont">
                <BtnText text="Найти" cb={getNav(LINK_FIND)}/>
                <BtnText text="Создать" cb={getNav(LINK_CREATE)}/>
                <BtnText text="Правила" cb={throwMessage}/>
                <BtnText text="Имя" color="red" cb={getNav(LINK_ENTER)}/>
            </div>
        </div>

    );
};

export default StartPage;