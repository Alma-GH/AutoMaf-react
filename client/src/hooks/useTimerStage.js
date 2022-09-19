import {useEffect, useState} from "react";
import Timer from "../tools/Services/Timer";

export const useTimerStage = (time, endStage,endCB, stopCondition,stopCB)=>{

  const [stage, setStage] = useState(0)

  function timer(){
    setStage(0)
    Timer.interval("start loader", ()=>{
      setStage(prevState => prevState+1)
    }, time, true)
  }
  function stopTimer(cb){
    Timer.stopInterval("start loader")
    cb()
    setStage(0)
  }

  useEffect(()=>{
    if(stage===endStage){
      stopTimer(endCB)
    }
  }, [stage])

  useEffect(()=>{
    // if(stopCondition){
      if(stage!==0)
      stopTimer(stopCB)
    // }
  }, [stopCondition])


  return [stage, timer]
}