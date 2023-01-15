import {AVATAR_DEAD, AVATAR_JUDGED, AVATAR_NORMAL, AVATAR_SPEAK, AVATAR_TIMER} from "../../../../tools/const";
import cls from "./GameTableCard.module.scss";
import imgCross from "../../../../assets/imgs/cancel.png";
import imgBalance from "../../../../assets/imgs/balance.png";
import React, {useContext} from "react";
import {ServerTimerContext} from "../../../../context/contexts";

const Avatar = ({state=AVATAR_NORMAL})=>{

  const tContext = useContext(ServerTimerContext)
  const time = tContext?.timer?.time

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
      {state === AVATAR_TIMER &&
      <>
        {time}
      </>
      }
    </div>
  )
}

export default Avatar