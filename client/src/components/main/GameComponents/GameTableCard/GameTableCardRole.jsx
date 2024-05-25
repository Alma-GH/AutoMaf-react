import React, {useContext} from 'react';
import cn from "./GameTableCard.module.scss"
import {CardContext, RoomContext} from "../../../../context/contexts";
import Socket from "../../../../tools/Services/Socket";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import GameService from "../../../../tools/Services/GameService";
import clsx from "clsx";


const GameTableCardRole = ({card}) => {

  const {setVisCard} = useContext(CardContext)
  const context = useContext(RoomContext)
  const me = context.player
  const room = context.room

  //click card events
  function chooseCard(){
    if(!card.isNotTaken)
      return

    const rID = GameService.getRoomID(room)
    const pID = GameService.getID(me)
    const message = MessageCreator.chooseCard(rID, pID, card.index)

    Socket.send(JSON.stringify(message))
    setVisCard(true)
  }

  return (
    <div
      className={clsx(cn.container, cn.cardRole, !card.isNotTaken && cn.invis)}
      onClick={chooseCard}
    >
      <span>?</span>
    </div>
  );
};

export default GameTableCardRole;