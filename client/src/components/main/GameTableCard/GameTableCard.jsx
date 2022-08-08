import React from 'react';
import imgCross from "./../../../assets/imgs/cancel.png"
import {AVATAR_NORMAL,AVATAR_SPEAK,AVATAR_DEAD} from "./../../../tools/const"
import cls from "./GameTableCard.module.scss"

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
    </div>
  )
}

const GameTableCard = ({card,
  // name,avatar,votes
}) => {

  //temp data
  const votes = 5
  const name = "Roman"

  function takeCard(){
    console.log({card})
  }

  return (
    <div className={cls.parent} onClick={takeCard}>
      {votes>0 &&
        <div className={cls.counter}>{votes}</div>
      }

      <Avatar state={AVATAR_DEAD}/>

      <div className={cls.name}>{name}</div>
    </div>
  );
};

export default GameTableCard;