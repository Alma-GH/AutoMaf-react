import {
  AVATAR_DEAD,
  AVATAR_JUDGED,
  AVATAR_NORMAL,
  AVATAR_SPEAK,
  AVATAR_TIMER,
  AVATAR_UNKNOWN
} from "../../../../tools/const";
import cn from "./CardType.module.scss";
import imgCross from "../../../../assets/imgs/cancel.png";
import imgBalance from "../../../../assets/imgs/balance.png";
import React, {useContext} from "react";
import {ServerTimerContext} from "../../../../context/contexts";
import Avatar from "../../Avatar/Avatar";

const CardType = ({state=AVATAR_NORMAL, avatarIndex=3})=>{

  const tContext = useContext(ServerTimerContext)
  const time = tContext?.timer?.time

  return (
    <div className={cn.container}>
      {[AVATAR_NORMAL,AVATAR_DEAD].includes(state)  &&
        <>
          <Avatar index={avatarIndex} addCls={cn.avatar} />
          {state===AVATAR_DEAD && <img className={cn.cross} src={imgCross} alt="DEAD"/>}
        </>
      }
      {state === AVATAR_SPEAK &&
        <>
          <div className={cn.exclPointUp}/>
          <div className={cn.exclPointDown}/>
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

export default CardType