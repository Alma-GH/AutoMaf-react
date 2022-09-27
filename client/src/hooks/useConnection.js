import {useContext} from "react";
import {MessageContext, RoomContext, ServerTimerContext} from "../context/contexts";
import {errorByTimer, setConnection} from "../tools/func";
import {LINK_PREPARE} from "../tools/const";
import {useNavigate} from "react-router-dom";


export const useConnection = (cb, keyT)=>{

  const nav = useNavigate()
  const mContext = useContext(MessageContext)
  const roomControl = useContext(RoomContext)
  const tContext = useContext(ServerTimerContext)


  function connect() {
    setConnection(
      cb,
      roomControl.setRoom,
      player=>{
        roomControl.setPlayer(player)
        nav(LINK_PREPARE)
      },
      message=>{
        errorByTimer(mContext.setError, message,
          keyT, 3000)
      },
      tContext.setTimer
    )
  }

  return connect
}