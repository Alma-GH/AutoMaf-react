import Socket from "./Services/Socket";
import Timer from "./Services/Timer";
import MessageCreator from "./Services/MessageCreator";


export const setConnection = (cb,setRoom,setPlayer,setError,setTimer,setLoading)=>{
  if(!Socket.getState(true))
    Socket.connect(cb, data=>{
      const enumMC = MessageCreator.constructor

      if([enumMC.E_CREATE_ROOM
        ,enumMC.E_FIND_ROOM
        ,enumMC.E_START_GAME
        ,enumMC.E_STOP_GAME
        ,enumMC.E_CHOOSE_CARD
        ,enumMC.E_READINESS
        ,enumMC.E_VOTE_NIGHT
        ,enumMC.E_VOTE
        ,enumMC.E_NEXT_JUDGED
        ,enumMC.E_SETTINGS
        ,enumMC.E_QUIT].includes(data.event))
        setRoom(data.room)

      if(enumMC.E_ERROR === data.event)
        setError(data.message)
      if(enumMC.E_PLAYER_DATA === data.event)
        setPlayer(data.player)
      if(enumMC.E_TIMER === data.event)
        setTimer(data.timer)
    },()=>{
      setError("Сокет закрылся")
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


export const shortWord = (word, length)=>{
  return word.length<=length ? word : word.slice(0,length) + "..."
}