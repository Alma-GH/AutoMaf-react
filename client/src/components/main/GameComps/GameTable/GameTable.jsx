import React from 'react';
import cls from "./GameTable.module.scss"
import {PHASE_PREPARE} from "../../../../tools/const";
import GameTableCardRole from "../GameTableCard/GameTableCard.Role";
import GameTableCardPlayer from "../GameTableCard/GameTableCard.Player";


const GameTable = ({players=[], cards=[], phase}) => {

  let set
  if(phase === PHASE_PREPARE){
    set = cards.map((card,ind)=>(
      <GameTableCardRole
        //TODO: change key-index on key-name(id)
        key={ind}
        card={{role:card,index:ind}}
      />
    ))
  }else{
    set = players.map((player,ind)=>(
      <GameTableCardPlayer
        //TODO: change key-index on key-name(id)
        key={ind}
        player={player}
      />
    ))
  }


  return (
    <div className={cls.parent}>
      {set}
    </div>
  );
};

export default GameTable;