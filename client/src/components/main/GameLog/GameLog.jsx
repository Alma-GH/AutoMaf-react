import React, {useContext, useState} from 'react';
import cls from "./GameLog.module.scss"
import Loader from "../../Notification/Loader";
import BtnIco from "../../UI/BtnIco/BtnIco";
import imgVote from "./../../../assets/imgs/megaphone.png"
import imgCross from "./../../../assets/imgs/cancel.png"
import GameVote from "./../GameVote/GameVote"
import {RoomContext} from "../../../context/room";

const GameLog = () => {

  const game = useContext(RoomContext).room?.game

  const info = game
    ? {
        phase: game.phasePath[game.phaseIndex],
        day: game.numDay,
        prepare: game.players.filter(player=>player.readiness).length,
        all: game.players.filter(player=>player.alive).length,
      }
      :null

  //temp data
  const log = [
    {from:"Log", text: "Лобби создано"},
    {from:"Log", text: "Игрок Роман присоединился"},
    {from:"Log", text: "Игрок Никита присоединился"},
    {from:"Log", text: "Игрок Артур присоединился"},
    {from:"Log", text: "Игрок Дарья присоединился"},
  ]
  const [visVote, setVisVote] = useState(false);


  return (
    <div className={cls.parent}>
      <ul className={cls.info}>

        <li>
          Фаза:
          <br/> {info?.phase}
        </li>
        <li>
          Номер дня:
          <br/> {info?.day}
        </li>


        <li>
          Готовность:
          <br/> {info?.prepare}/{info?.all}
        </li>

      </ul>

      <ul className={cls.log}>
        {log.map((message,ind)=>(
          //TODO: change key-index on key-id(time)
          <li key={ind}>
            {message.from}: {message.text}
          </li>
        ))}
      </ul>

      <div className={cls.vote}>
        <BtnIco
          cb={()=>setVisVote(prev=>!prev)}
          img={visVote?imgCross:imgVote}
          disabled={false}
          isAnimStyle={true}
        />
      </div>


      <GameVote vis={visVote}/>
    </div>
  );
};

export default GameLog;