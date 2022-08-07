import React from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import BtnText from "../UI/BtnText/BtnText";
import PlayerSlot from "../main/PlayerSlot/PlayerSlot";

const PreparePage = () => {

  //temp data
  const players = [
    {name: "Roman", color: "red", isLead: true},
    {name: "Artur", color: "#00c509", isLead: false},
    {name: "Darya", color: "pink", isLead: false},
    {name: "Nikita", color: "#ff6200", isLead: false},
  ];
  const numPlayers = 4

  return (
    <div className="prepPage">

      <h1>Подготовка</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <div className={clsWin.count}>
            Игроков
            <span>{players.length}/{numPlayers}</span>
          </div>

          <div className={clsWin.players}>
            {players.map(player=>
              <PlayerSlot name={player.name} col={player.color} isLead={player.isLead}/>
            )}
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