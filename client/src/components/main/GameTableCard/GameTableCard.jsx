import React, {useContext} from 'react';
import imgCross from "./../../../assets/imgs/cancel.png"
import imgBalance from "./../../../assets/imgs/balance.png"
import {
  AVATAR_NORMAL,
  AVATAR_SPEAK,
  AVATAR_DEAD,
  PHASE_NIGHT_MAFIA,
  PHASE_DAY_SUBTOTAL,
  PHASE_DAY_TOTAL, AVATAR_JUDGED
} from "../../../tools/const"
import cls from "./GameTableCard.module.scss"
import {RoomContext} from "../../../context/room";
import Socket from "../../../tools/Services/Socket";



//temp
const Avatar = ({state=AVATAR_NORMAL})=>{

  return (
    <div className={cls.avatar}>
      {[AVATAR_NORMAL,AVATAR_DEAD].includes(state)  &&
        <>
          <div className={cls.head}/>
          <div className={cls.body}/>
          {state===AVATAR_DEAD && <img className={cls.cross} src={imgCross} alt="DEAD"/>}
        </>
      }
      {state === AVATAR_SPEAK &&
        <>
          <div className={cls.exclPointUp}/>
          <div className={cls.exclPointDown}/>
        </>
      }
      {state === AVATAR_JUDGED &&
        <>
          <img src={imgBalance} alt="Bal"/>
        </>
      }
    </div>
  )
}

const GameTableCard = ({card,player}) => {

  // //temp data
  // const votes = 5
  // const name = "Roman"

  const context = useContext(RoomContext)
  const me = context.player
  const room = context.room
  const phase = room?.game.phasePath[room.game.phaseIndex]

  const votes = room.game?.players
    .filter(pl=>pl.vote===player?._id).length
  const avatar = getAvatar(player)
  const name = player?._name

  //TODO: cant take if already have card
  //click card events
  function chooseCard(){
    if(card.role === null)
      return

    const message = {
      event: "choose_card",

      roomID: room.roomID,

      idPlayer: me._id,
      cardIndex: card.index,
    }

    Socket.send(JSON.stringify(message))
    console.log({card})
  }
  function vote(){
    const message = {
      event: "vote",

      roomID: room.roomID,

      idVoter: me._id,
      idChosen: player._id,
    }

    Socket.send(JSON.stringify(message))
  }
  function voteKill(){
    const message = {
      event: "vote_night",

      roomID: room.roomID,

      idVoter: me._id,
      idChosen: player._id,
    }

    Socket.send(JSON.stringify(message))
  }
  function message(){
    //TODO: set error message
    console.log("Need other phase")
  }

  function getFunction(phase){
    if(!phase)
      return message

    const map = {
      [PHASE_NIGHT_MAFIA]: voteKill,
      [PHASE_DAY_SUBTOTAL]: vote,
      [PHASE_DAY_TOTAL]: vote
    }
    const func = map[phase]
    return func ? func : message
  }

  function getAvatar(player){
    if(card || !player)
      return AVATAR_NORMAL

    if(!player.alive)
      return AVATAR_DEAD

    if(player.speak)
      return AVATAR_SPEAK

    if(player.judged)
      return AVATAR_JUDGED

    return AVATAR_NORMAL
  }




  if(card){
    const style = []
    style.push(cls.parent)
    if(card.role === null)
      style.push(cls.invis)

    return (
      <div className={style.join(" ")} onClick={chooseCard}>
        <Avatar state={AVATAR_NORMAL}/>
      </div>
    )
  }

  return (
    <div className={cls.parent} onClick={getFunction(phase)}>
      {votes>0 &&
        <div className={cls.counter}>{votes}</div>
      }

      <Avatar state={avatar}/>

      <div className={cls.name}>{name}</div>
    </div>
  );
};

export default GameTableCard;