import React from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {useNavigate} from "react-router-dom";
import {LINK_CREATE, LINK_ENTER, LINK_FIND, LINK_LOGIN, LINK_STAT} from "../../tools/const";
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../../hooks/useAuth";
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";

const StartPage = () => {
  const {logout, auth} = useAuth()
  const nav = useNavigate()

  const getNav = (link) => () => nav(link);

  return (
    <div className="startPage">
      <Header />


      <MainCard addCls="buttonContainer">
        <BtnText text="Создать" cb={getNav(LINK_CREATE)}/>
        {auth?.isAuth && <BtnText text="Статистика" cb={getNav(LINK_STAT)}/>}
        <BtnText text="Имя" cb={getNav(LINK_ENTER)}/>
        {auth?.isAuth
          ? (<BtnText text="Выйти" type="secondary" cb={logout}/>)
          : (<BtnText text="Аутентификация" type="secondary" cb={getNav("../" + LINK_LOGIN)}/>)
        }
      </MainCard>

    </div>

  );
};

export default StartPage;