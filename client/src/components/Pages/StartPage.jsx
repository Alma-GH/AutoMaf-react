import React, {useContext} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {RoomContext} from "../../context/room";
import Socket from "../../tools/Services/Socket";
import {useNavigate} from "react-router-dom";
import {LINK_CREATE, LINK_ENTER, LINK_FIND} from "../../tools/const";

const StartPage = () => {

  const nav = useNavigate()


  function getNav(link){
    return ()=>nav(link)
  }


  return (
    <div className="startPage">
      <div className="btnCont">
        <BtnText text="Найти" cb={getNav(LINK_FIND)}/>
        <BtnText text="Создать" cb={getNav(LINK_CREATE)}/>
        <BtnText text="Правила" cb={getNav(LINK_ENTER)}/>
        <BtnText text="Имя" color="red" cb={getNav(LINK_ENTER)}/>
      </div>
    </div>

  );
};

export default StartPage;