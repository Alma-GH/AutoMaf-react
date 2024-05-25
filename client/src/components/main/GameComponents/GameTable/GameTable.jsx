import React from 'react';
import cn from "./GameTable.module.scss"
import {PHASE_PREPARE} from "../../../../tools/const";
import GameTableCardRole from "../GameTableCard/GameTableCardRole";
import GameTableCardPlayer from "../GameTableCard/GameTableCardPlayer";


const GameTable = ({players=[], cards=[], phase}) => {
  let set
  if(phase === PHASE_PREPARE){
    set = cards.map((card,ind)=>(
      <GameTableCardRole
        //TODO: change key-index on key-name(id)
        key={ind}
        card={{isNotTaken:card,index:ind}}
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
    <div className={cn.container}>
      {set}
    </div>
  );
};

export default GameTable;