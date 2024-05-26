import React, {useContext} from 'react';
import cls from "./GameObjective.module.scss"
import GameService from "../../../../tools/Services/GameService";
import {
  PHASE_DAY_DISCUSSION,
  PHASE_DAY_SUBTOTAL,
  PHASE_DAY_TOTAL,
  PHASE_NIGHT_DETECTIVE,
  PHASE_NIGHT_DOCTOR,
  PHASE_NIGHT_MAFIA,
  PHASE_PREPARE
} from "../../../../tools/const";
import {RoomContext} from "../../../../context/contexts";


//DEP NIGHT PHASES 4
const mapLabelByPhase = {
  [PHASE_PREPARE]: `Выберите карты и нажмите "готов"`,
  [PHASE_DAY_DISCUSSION]: `Нажмите "готов"`,
  [PHASE_DAY_SUBTOTAL]: "Выслушать игроков",
  [PHASE_DAY_TOTAL]: "Проголосовать за посадку",
}
const mapLabelByNightPhase = {
  [PHASE_NIGHT_MAFIA]: "Проголосовать за убийство",
  [PHASE_NIGHT_DETECTIVE]: "Проголосовать за расследование",
  [PHASE_NIGHT_DOCTOR]: "Проголосовать за лечение",
}
const civilLabel = "Дождитесь дня"


const GameObjective = ({vis}) => {

  const context = useContext(RoomContext)
  const room = context.room
  const game = GameService.getGame(room)

  const player = GameService.getPlayerByID(GameService.getID(context.player), game)

  function getObjectiveLabel(me){
    if(!me)
      return null
    if(!player.alive)
      return "Дождитесь окончания игры"
    if(me.speak)
      return "Проголосовать"

    const phaseNow = GameService.getPhase(game)

    return GameService.isNight(game)
      ? GameService.isPlayerToMatchNightPhase(me,game)
        ? mapLabelByNightPhase[phaseNow]
        : civilLabel
      : mapLabelByPhase[phaseNow]
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
        {getObjectiveLabel(player)}
      </p>

    </div>
  );
};

export default GameObjective;

