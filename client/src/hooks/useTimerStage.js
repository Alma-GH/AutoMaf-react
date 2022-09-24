import {useEffect, useState} from "react";
import Timer from "../tools/Services/Timer";

const KEY_LOADER = "timer stage"

export const useTimerStage = (time, endStage,endCB, stopCondition,stopCB)=>{

  const [stage, setStage] = useState(0)

  function timer(){
    setStage(0)
    Timer.interval(KEY_LOADER, ()=>{
      setStage(prevState => prevState+1)
    }, time, true)
  }
  function stopTimer(cb){
    Timer.stopInterval(KEY_LOADER)
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