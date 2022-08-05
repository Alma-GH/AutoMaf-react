import React from 'react';
import BtnText from "../UI/BtnText/BtnText";

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