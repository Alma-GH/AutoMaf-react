import React, {useContext} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {RoomContext} from "../../context/room";
import Socket from "../../tools/Services/Socket";

const StartPage = () => {


  return (
    <div className="startPage">
      <div className="btnCont">
        <BtnText text="Найти"/>
        <BtnText text="Создать"/>
        <BtnText text="Правила"/>
        <BtnText text="Имя" color="red"/>
      </div>
    </div>

  );
};

export default StartPage;