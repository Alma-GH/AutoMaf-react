import {AVATAR_DEAD, AVATAR_NORMAL, AVATAR_SPEAK} from "../../../../tools/const";
import cn from "./CardType.module.scss";
import imgCross from "../../../../assets/imgs/cancel.png";
import React from "react";
import Avatar from "../../Avatar/Avatar";

const CardType = ({state=AVATAR_NORMAL, avatarIndex=3})=>{
  return (
    <div className={cn.container}>
      {[AVATAR_NORMAL,AVATAR_DEAD].includes(state)  &&
        <>
          <Avatar index={avatarIndex} addCls={cn.avatar} />
          {state===AVATAR_DEAD && <img className={cn.cross} src={imgCross} alt="DEAD"/>}
        </>
      }
      {state === AVATAR_SPEAK &&
        <div className={cn.excl}>
          <div className={cn.exclPointUp}/>
          <div className={cn.exclPointDown}/>
        </div>
      }
    </div>
  )
}

export default CardType