import Socket from "./Services/Socket";
import Timer from "./Services/Timer";
import {MessageContext} from "../context/contexts";
import MessageCreator from "./Services/MessageCreator";


export const setConnection = (cb,setRoom,setPlayer,setError,setTimer)=>{
  if(!Socket.getState(true))
    Socket.connect(cb, data=>{
      if(!data.event)
        setRoom(data)
      if(["create_room","find_room"].includes(data.event))
        setPlayer(data.player)
      if(data.event === "error")
        setError(data.message)
      if(data.event === "get_timer")
        setTimer(data.time)
    })
  else{
    cb()
    console.log("Подключение уже существует")
  }
}

//TODO: different keys
export const errorByTimer = (setError, message, key, time)=>{
  setError({visible: true,message})
  Timer.timeout(key,()=>{
    setError({visible: false})
  }, time)
}