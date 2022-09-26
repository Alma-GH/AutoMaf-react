import {AVATAR_DEAD, AVATAR_JUDGED, AVATAR_NORMAL, AVATAR_SPEAK} from "../../../../tools/const";
import cls from "./GameTableCard.module.scss";
import imgCross from "../../../../assets/imgs/cancel.png";
import imgBalance from "../../../../assets/imgs/balance.png";
import React from "react";

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
      {state === AVATAR_JUDGED &&
      <>
        <img src={imgBalance} alt="Bal"/>
      </>
      }
    </div>
  )
}

export default Avatar