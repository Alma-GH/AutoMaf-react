import React from 'react';
import GameTableCard from "./../GameTableCard/GameTableCard"
import cls from "./GameTable.module.scss"
import {PHASE_PREPARE} from "../../../tools/const";


const GameTable = ({cards=[], phase}) => {

  return (
    <div className={cls.parent}>
      {cards.map((card,ind)=>(
        phase===PHASE_PREPARE
          ? <GameTableCard
              //TODO: change key-index on key-name(id)
              key={ind}
              card={{role:card,index:ind}}
            />
          : <GameTableCard
              //TODO: change key-index on key-name(id)
              key={ind}
              player={card}
            />
        )
      )}
    </div>
  );
};

export default GameTable;