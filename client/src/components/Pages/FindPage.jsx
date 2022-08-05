import React from 'react';
import WindowInput from "../WindowInput/WindowInput";
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";

const FindPage = () => {
  return (
    <div className="findPage">
      <WindowInput>

        <div className="inputCont">
          <InputC placeholder="Название комнаты"/>
          <InputC placeholder="Пароль"/>
        </div>

        <div className="btnCont">
          <BtnText text="Назад" color="red"/>
          <BtnText text="Войти"/>
        </div>

      </WindowInput>
    </div>
  );
};

export default FindPage;