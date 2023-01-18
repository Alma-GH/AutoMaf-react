import React, {useContext} from 'react';
import cls from "./GameObjective.module.scss"
import GameService from "../../../../tools/Services/GameService";
import {
  CARD_CIVIL,
  CARD_MAFIA, PHASE_DAY_DISCUSSION,
  PHASE_DAY_SUBTOTAL,
  PHASE_DAY_TOTAL,
  PHASE_NIGHT_MAFIA,
  PHASE_PREPARE
} from "../../../../tools/const";
import {RoomContext} from "../../../../context/contexts";

const GameObjective = ({vis}) => {

  const context = useContext(RoomContext)
  const room = context.room
  const game = GameService.getGame(room)

  const phase = GameService.getPhase(game)
  const player = GameService.getPlayerByID(GameService.getID(context.player), game)

  function getObjectiveLabel(phaseNow, me){
    if(phaseNow === PHASE_PREPARE)
      return `Выберите карты и нажмите "готов"`
    if(!me)
      return null
    if(!player.alive)
      return "Дождитесь окончания игры"
    if(phaseNow === PHASE_DAY_DISCUSSION)
      return `Нажмите "готов"`

    const myRole = GameService.getRole(me,game)
    //DEP NIGHT PHASES
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

  const style = [cls.parent]
  if(vis)
    style.push(cls.vis)
  return (
    <div className={style.join(" ")}>
      <div className={cls.head}>
        <h4>Задача</h4>
      </div>
      <p>
        {getObjectiveLabel(phase,player)}
      </p>

    </div>
  );
};

export default GameObjective;

