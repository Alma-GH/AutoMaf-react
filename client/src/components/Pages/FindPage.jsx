import React, {useState} from 'react';
import WindowInput from "../WindowInput/WindowInput";
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import clsWin from "./../WindowInput/WindowInput.module.scss"

const FindPage = () => {

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")

  return (
    <div className="prepPage">

      <h1>Найти комнату</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <div className={clsWin.thinCont}>
            <InputC
              placeholder="Название комнаты"
              val={room}
              setVal={setRoom}
            />
            <InputC
              placeholder="Пароль"
              val={pass}
              setVal={setPass}
            />
          </div>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red"/>
          <BtnText text="Войти"/>
        </div>

      </WindowInput>
    </div>
  );
};

export default FindPage;