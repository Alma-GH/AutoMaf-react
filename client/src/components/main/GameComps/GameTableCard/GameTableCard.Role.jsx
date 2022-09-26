import React, {useContext} from 'react';
import {AVATAR_NORMAL} from "../../../../tools/const"
import cls from "./GameTableCard.module.scss"
import {RoomContext} from "../../../../context/contexts";
import Socket from "../../../../tools/Services/Socket";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import Avatar from "./Avatar";
import GameService from "../../../../tools/Services/GameService";


const GameTableCardRole = ({card}) => {

  const context = useContext(RoomContext)
  const me = context.player
  const room = context.room

  //click card events
  function chooseCard(){
    if(card.role === null)
      return

    const rID = GameService.getRoomID(room)
    const pID = GameService.getID(me)
    const message = MessageCreator.chooseCard(rID, pID, card.index)

    Socket.send(JSON.stringify(message))
  }

  const style = []
  style.push(cls.parent)
  if(card.role === null)
    style.push(cls.invis)
  return (
    <div className={style.join(" ")} onClick={chooseCard}>
      <Avatar state={AVATAR_NORMAL}/>
    </div>
  );
};

export default GameTableCardRole;