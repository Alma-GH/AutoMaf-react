import React, {useContext, useEffect} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import BtnText from "../UI/BtnText/BtnText";
import PlayerSlot from "../main/PlayerSlot/PlayerSlot";
import {RoomContext} from "../../context/contexts";
import Socket from "../../tools/Services/Socket";
import {useNavigate} from "react-router-dom";
import {LINK_GAME, LINK_START} from "../../tools/const";

const colors = ["red", "#00c509", "pink", "#ff6200"]

const PreparePage = () => {

  const nav = useNavigate()


  const context = useContext(RoomContext)

  const player  = context.player

  const room    = context.room
  const players = room ? room.players : []
  const max     = room ? room.maxPlayers : 0
  const id      = room?.roomID


  function startGame(){
    //TODO: message creator in Socket
    const message = {
      event: "start_game",

      roomID: id
    }

    Socket.send(JSON.stringify(message))
  }

  function quit(){
    //TODO: modal confirm window

    const message = {
      event: "quit_player",

      roomID: room.roomID,

      idPlayer: player._id
    }

    Socket.send(JSON.stringify(message))
    context.setRoom(null)
    context.setPlayer(null)
    nav(LINK_START)
  }

  useEffect(()=>{
    //TODO: messages
    if(room?.inGame)
      nav(LINK_GAME)
  },[room])


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
              <PlayerSlot name={player._name} col={colors[player._id%colors.length]} isLead={player._id === 0}/>
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