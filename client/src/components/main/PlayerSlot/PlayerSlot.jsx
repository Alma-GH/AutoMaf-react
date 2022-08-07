import React from 'react';
import cls from "./PlayerSlot.module.scss"

const PlayerSlot = ({name, col, isLead}) => {


  return (
    <div style={{backgroundColor: col}} className={cls.parent}>
      <div className={cls.circles}>
        <div className={cls.avatar}/>
        {isLead && <div className={cls.leader}/>}
      </div>


      <div className={cls.name}>
        {name}
      </div>
    </div>
  );
};

export default PlayerSlot;