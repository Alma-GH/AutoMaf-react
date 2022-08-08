import React from 'react';
import GameTableCard from "./../GameTableCard/GameTableCard"
import cls from "./GameTable.module.scss"


const GameTable = ({cards=[]}) => {

  return (
    <div className={cls.parent}>
      {cards.map((card,ind)=>
        <GameTableCard
          //TODO: change key-index on key-name(id)
          key={ind}
          card={card}
        />
      )}
    </div>
  );
};

export default GameTable;