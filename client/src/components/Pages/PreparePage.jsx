import React from 'react';
import WindowInput from "../WindowInput/WindowInput";
import clsWin from "../WindowInput/WindowInput.module.scss"
import BtnText from "../UI/BtnText/BtnText";
import PlayerSlot from "../PlayerSlot/PlayerSlot";

const PreparePage = () => {

  const players = []

  return (
    <div className="prepPage">

      <h1>Подготовка</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <div className={clsWin.count}>
            Игроков
          </div>

          <div className={clsWin.players}>
            <PlayerSlot name="Roman" col="red" isLead={true}/>
            <PlayerSlot name="Artur" col="green"/>
            <PlayerSlot name="Darya" col="pink"/>
          </div>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Выйти" color="red"/>
          <BtnText text="Начать"/>
        </div>

      </WindowInput>
    </div>
  );
};

export default PreparePage;