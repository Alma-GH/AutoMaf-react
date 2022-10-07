import React, {useContext, useState} from 'react';
import cls from "./GameLog.module.scss"
import BtnIco from "../../../UI/BtnIco/BtnIco";
import imgVote from "../../../../assets/imgs/megaphone.png"
import imgCross from "../../../../assets/imgs/cancel.png"
import imgQuestion from "../../../../assets/imgs/question.png"
import imgRight from "../../../../assets/imgs/right-arrow.png"
import imgLeft from "../../../../assets/imgs/left-arrow.png"
import GameVote from "../GameVote/GameVote"
import {RoomContext} from "../../../../context/contexts";
import GameService from "../../../../tools/Services/GameService";
import LogInfo from "./LogInfo";
import LogMessages from "./LogMessages";
import GameObjective from "../GameObjective/GameObjective";


const GameLog = () => {

  const context = useContext(RoomContext)
  const room = context.room

  const log = GameService.getLog(room)

  const [visVote, setVisVote] = useState(false);
  const [visObjective, setVisObjective] = useState(false)
  const [visLog, setVisLog] = useState(true)

  function toggleVote(){
    setVisObjective(false)
    setVisVote(prev=>!prev)
  }
  function toggleObjective(){
    setVisVote(false)
    setVisObjective(prev=>!prev)
  }
  function toggleLog(){
    setVisLog(prev=>!prev)
  }

  const style = [cls.parent]
  if(visLog)
    style.push(cls.vis)
  return (
    <div className={style.join(" ")}>
      <LogInfo/>

      <LogMessages log={log}/>

      <div className={cls.btns}>
        <BtnIco
          cb={toggleVote}
          img={visVote?imgCross:imgVote}
          disabled={false}
          isAnimStyle={true}
        />
        <BtnIco
          cb={toggleObjective}
          img={visObjective?imgCross:imgQuestion}
          disabled={false}
          isAnimStyle={true}
        />
        <BtnIco
          cb={toggleLog}
          img={visLog?imgLeft:imgRight}
          disabled={false}
          isAnimStyle={true}
        />
      </div>

      <GameObjective vis={visObjective}/>
      <GameVote vis={visVote}/>
    </div>
  );
};

export default GameLog;

