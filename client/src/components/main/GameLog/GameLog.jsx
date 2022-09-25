import React, {useContext, useEffect, useRef, useState} from 'react';
import cls from "./GameLog.module.scss"
import BtnIco from "../../UI/BtnIco/BtnIco";
import imgVote from "./../../../assets/imgs/megaphone.png"
import imgCross from "./../../../assets/imgs/cancel.png"
import GameVote from "./../GameVote/GameVote"
import {RoomContext} from "../../../context/contexts";
import GameService from "../../../tools/Services/GameService";
import {
  CARD_CIVIL,
  CARD_MAFIA, CIVIL_WIN, MAFIA_WIN,
  PHASE_DAY_DISCUSSION,
  PHASE_DAY_SUBTOTAL,
  PHASE_DAY_TOTAL,
  PHASE_NIGHT_MAFIA,
  PHASE_PREPARE
} from "../../../tools/const";



const LogInfo = ()=>{

  const context = useContext(RoomContext)
  const room = context.room
  const game = GameService.getGame(room)
  const player = GameService.getPlayerByID(GameService.getID(context.player), game)
  const members = GameService.getMembers(room)
  const alivePlayers = GameService.getPlayersAlive(game)

  const nextPhase = GameService.getPhaseNext(game)
  const phase = GameService.getPhase(game)
  const end = GameService.getEnd(game)

  const info = game
    ? {
      phase: GameService.getPhaseRus(game),
      day: game.numDay,

      prepare: GameService.getPlayersReady(game).length,
      all: (phase !== PHASE_PREPARE) ? alivePlayers.length : members.length,
    }
    :null

  const list = [
    {name:"Фаза", value: info?.phase},
    {name:"Номер дня", value: info?.day},
    [PHASE_PREPARE,PHASE_DAY_DISCUSSION].includes(phase)
      ? {name:"Готовность", value: `${getVoteLabel(nextPhase)}(${info?.prepare}/${info?.all})`}
      : {name:"Задача", value: getObjectiveLabel(phase,player)}
  ]

  if(end){
    const label = getEndLabel(end)
    list.length = 0
    list.push({name: "Победили", value: label.who, col: label.color})
  }


  function getVoteLabel(phaseNext){
    const map = {
      [PHASE_DAY_DISCUSSION]: "Начало игры",

      [PHASE_NIGHT_MAFIA]: "Следующий день",
      [PHASE_DAY_SUBTOTAL]: "Промежуточный итог",
      [PHASE_DAY_TOTAL]: "Итог"
    }

    return map[phaseNext]
  }
  function getObjectiveLabel(phaseNow, me){
    if(!me)
      return null
    if(!player.alive)
      return "Дождитесь окончания игры"

    const myRole = GameService.getRole(me,game)
    const map = {
      [PHASE_NIGHT_MAFIA+CARD_CIVIL]: "Дождитесь дня",
      [PHASE_NIGHT_MAFIA+CARD_MAFIA]: "Проголосовать за убийство",
      [PHASE_DAY_SUBTOTAL]: "Выслушать игроков",
      [PHASE_DAY_TOTAL]: "Проголосовать",
    }
    if(me.speak)
      return "Проголосовать"
    return phaseNow===PHASE_NIGHT_MAFIA ? map[phaseNow+myRole] : map[phaseNow]
  }
  function getEndLabel(end){
    if(!end)
      return null
    const map = {
      [CIVIL_WIN]: ["Мирные", "lightgreen"],
      [MAFIA_WIN]: ["Мафия", "red"]
    }
    return {who: map[end][0], color: map[end][1]}
  }

  return (
    <ul className={cls.info}>
      {list.map(el=>(
        <li key={el.name}>
          {el.name}:
          <br/> <span style={el.col ? {color: el.col} : null}>{el.value}</span>
        </li>
      ))}
    </ul>
  );
}

const LogMessages = ({log})=>{

  const ref = useRef()

  useEffect(()=>{

    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth"
    });

  }, [log])

  return (
    <ul className={cls.log} ref={ref}>
      {log?.map((message,ind)=>(
        //TODO: change key-index on key-id(time)
        <li key={ind}>
          {message.who}: {message.message}
        </li>
      ))}
    </ul>
  )
}

const GameLog = () => {

  const context = useContext(RoomContext)
  const room = context.room

  const log = GameService.getLog(room)

  const [visVote, setVisVote] = useState(false);
  /*TODO: const [visObjective, setVisObjective] = useState(false)
      <BtnIco
        cb={()=>setVisObjective(prev=>!prev)}
        img={visObjective?imgCross:imgQuestion}
        disabled={false}
        isAnimStyle={true}
      />
      <GameObjective vis={visObjective}/>
  * */

  return (
    <div className={cls.parent}>
      <LogInfo/>

      <LogMessages log={log}/>

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

