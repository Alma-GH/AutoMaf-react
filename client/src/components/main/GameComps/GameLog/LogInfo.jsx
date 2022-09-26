import React, {useContext} from 'react';
import {RoomContext} from "../../../../context/contexts";
import GameService from "../../../../tools/Services/GameService";
import {
  CIVIL_WIN,
  MAFIA_WIN,
  PHASE_DAY_DISCUSSION,
  PHASE_DAY_SUBTOTAL,
  PHASE_DAY_TOTAL,
  PHASE_NIGHT_MAFIA,
  PHASE_PREPARE
} from "../../../../tools/const";
import cls from "./GameLog.module.scss";

const LogInfo = () => {
  const context = useContext(RoomContext)
  const room = context.room
  const game = GameService.getGame(room)
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
  ]
  if([PHASE_PREPARE,PHASE_DAY_DISCUSSION].includes(phase)){
    list.push({name:"Готовность", value: `${getVoteLabel(nextPhase)}(${info?.prepare}/${info?.all})`})
  }
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
};

export default LogInfo;