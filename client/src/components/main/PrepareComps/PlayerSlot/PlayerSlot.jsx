import React from 'react';
import cls from "./PlayerSlot.module.scss"

const PlayerSlot = ({name, col, isLead, you}) => {

  const style = []
  style.push(cls.parent)
  if(you)
    style.push(cls.you)

  return (
    <div style={{backgroundColor: col}} className={style.join(" ")}>
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