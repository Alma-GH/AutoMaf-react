import {useContext, useEffect} from "react";
import {MessageContext, RoomContext, ServerTimerContext} from "../context/contexts";
import {errorByTimer, setConnection} from "../tools/func";
import {LINK_PREPARE, S_LOST_PLAYER, S_LOST_ROOM, S_NICK} from "../tools/const";
import {useNavigate} from "react-router-dom";
import Socket from "../tools/Services/Socket";


export const useConnection = (cb, keyT)=>{

  const nav = useNavigate()
  const mContext = useContext(MessageContext)
  const roomControl = useContext(RoomContext)
  const tContext = useContext(ServerTimerContext)

  // useEffect(()=>{
  //
  //   Socket.setBeacon(()=>{
  //     const message = {
  //       text:"I'm here",
  //       roomID: roomControl?.room?.roomID,
  //       playerID: roomControl?.player?._id
  //     }
  //     Socket.send(JSON.stringify(message))
  //   })
  //
  // }, [roomControl])


  function connect() {
    mContext.setLoading(true)
    setConnection(
      cb,
      roomControl.setRoom,
      player=>{
        roomControl.setPlayer(player)
        nav(LINK_PREPARE)
        localStorage.removeItem(S_LOST_ROOM)
        localStorage.removeItem(S_LOST_PLAYER)
        mContext.setLoading(false)
      },
      message=>{
        errorByTimer(mContext.setError, message,
          keyT, 3000)
        localStorage.removeItem(S_LOST_ROOM)
        localStorage.removeItem(S_LOST_PLAYER)
        mContext.setLoading(false)
      },
      tContext.setTimer
    )
  }

  return connect
}