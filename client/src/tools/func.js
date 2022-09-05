import Socket from "./Services/Socket";
import Timer from "./Services/Timer";


export const setConnection = (cb,setRoom,setPlayer,setError)=>{
  if(!Socket.getState(true))
    Socket.connect(cb, data=>{
      if(!data.event)
        setRoom(data)
      if(["create_room","find_room"].includes(data.event))
        setPlayer(data.player)
      if(data.event === "error")
        setError(data.message)
    })
  else{
    cb()
    console.log("Подключение уже существует")
  }
}

export const errorByTimer = (setError, message, key, time)=>{
  setError({visible: true,message})
  Timer.timeout(key,()=>{
    setError({visible: false})
  }, time)
}