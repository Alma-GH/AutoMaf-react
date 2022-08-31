import React, {useContext, useEffect, useState} from 'react';
import GameTable from "../main/GameTable/GameTable";
import BtnText from "../UI/BtnText/BtnText";
import CardViewer from "../main/GameCardViewer/CardViewer";
import GameTimer from "../main/GameTimer/GameTimer"
import GameLog from "../main/GameLog/GameLog";
import {
  CARD_MAFIA,
  CARD_CIVIL,
  PHASE_PREPARE,
  PHASE_DAY_DISCUSSION,
  PHASE_NIGHT_MAFIA,
  LINK_GAME, LINK_PREPARE, LINK_START
} from "../../tools/const"
import {RoomContext} from "../../context/room";
import Socket from "../../tools/Services/Socket";
import {useNavigate} from "react-router-dom";

const GamePage = () => {
  //TODO: if end game btns dont work

  const nav = useNavigate()

  //server data
  const context = useContext(RoomContext)

  const room = context.room
  const player = context.player

  const game = room?.game
  const cards = game?.cards
  const players = game?.players
  const end = game?.end
  const phase = game ? game.phasePath[game.phaseIndex] : null


  //vars
  const disabledBtnReady =
    !players?.map(player=>player._id).includes(player._id) ||
    ![PHASE_DAY_DISCUSSION,PHASE_PREPARE].includes(phase)
  //TODO: add night phases
  const sleep =
    [PHASE_NIGHT_MAFIA].includes(phase) &&
    players?.find(pl=>pl._id === player._id).role !== CARD_MAFIA


  function readiness(){
    const message = {
      event: "readiness",

      roomID: context.room.roomID,

      idPlayer: player._id,
    }

    Socket.send(JSON.stringify(message))
  }

  function restart(){

    const message = {
      event: "start_game",

      roomID: room.roomID
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
    context.setRoom(null)
    context.setPlayer(null)
    nav(LINK_START)
  }


  useEffect(()=>{
    //TODO: messages
    if(!room?.inGame)
      nav(LINK_PREPARE)
  },[room])

  return (
    <div className="gamePage">

      <div className="gameTable">
        <GameTable
          cards={ (phase===PHASE_PREPARE
            ? cards
            : players ) ?? []}
          phase={phase}
        />
      </div>

      <div className="btnCont">
        <BtnText text="Выйти" color="red" cb={quit}/>
        <BtnText text="Готов" disabled={disabledBtnReady} cb={readiness}/>
        {end
          ? <BtnText text="Новая игра" color="yellow" cb={restart}/>
          : <GameTimer/>
        }
      </div>

      <CardViewer enabled={true}/>

      <div className="gameTimer">

      </div>


      <div className="gameLog">
        <GameLog/>
      </div>

      {sleep && <div className="gameBack"/>}
    </div>
  );
};

export default GamePage;