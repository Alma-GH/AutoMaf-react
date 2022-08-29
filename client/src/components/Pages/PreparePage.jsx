import React, {useContext} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import BtnText from "../UI/BtnText/BtnText";
import PlayerSlot from "../main/PlayerSlot/PlayerSlot";
import {RoomContext} from "../../context/room";
import Socket from "../../tools/Services/Socket";

const colors = ["red", "#00c509", "pink", "#ff6200"]

const PreparePage = () => {

  //temp data
  // const players = [
  //   {name: "Roman", color: "red", isLead: true},
  //   {name: "Artur", color: "#00c509", isLead: false},
  //   {name: "Darya", color: "pink", isLead: false},
  //   {name: "Nikita", color: "#ff6200", isLead: false},
  // ];
  // const numPlayers = 4

  const context = useContext(RoomContext)

  const player  = context.player

  const room    = context.room
  const players = room.players
  const max     = room.maxPlayers
  const id      = room.roomID


  function startGame(){
    //TODO: message creator in Socket
    const message = {
      event: "start_game",

      roomID: id
    }

    Socket.send(JSON.stringify(message))
  }

  function quit(){
    const message = {
      event: "quit_player",

      roomID: room.roomID,

      idPlayer: player._id
    }

    Socket.send(JSON.stringify(message))
  }


  return (
    <div className="prepPage">

      <h1>Подготовка</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <div className={clsWin.count}>
            Игроков
            <span>{players.length}/{max}</span>
          </div>

          <div className={clsWin.players}>
            {players.map(player=>
              <PlayerSlot name={player._name} col={colors[player._id]} isLead={player._id === 0}/>
            )}
          </div>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Выйти" color="red" cb={quit}/>
          <BtnText text="Начать" cb={startGame} disabled={player?._id !== 0}/>
        </div>

      </WindowInput>
    </div>
  );
};

export default PreparePage;