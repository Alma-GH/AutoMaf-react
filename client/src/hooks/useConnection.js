import {useContext} from "react";
import {MessageContext, RoomContext, ServerTimerContext} from "../context/contexts";
import {LINK_PREPARE, S_ACCESS_TOKEN, S_LOST_PLAYER, S_LOST_ROOM} from "../tools/const";
import {useNavigate} from "react-router-dom";
import Socket from "../tools/Services/Socket";
import MessageCreator from "../tools/Services/MessageCreator";
import {toast} from "react-toastify";

const roomEventTypes = [
  MessageCreator.E_CREATE_ROOM,
  MessageCreator.E_FIND_ROOM,
  MessageCreator.E_START_GAME,
  MessageCreator.E_STOP_GAME,
  MessageCreator.E_CHOOSE_CARD,
  MessageCreator.E_READINESS,
  MessageCreator.E_VOTE_NIGHT,
  MessageCreator.E_VOTE,
  MessageCreator.E_NEXT_JUDGED,
  MessageCreator.E_SETTINGS,
  MessageCreator.E_QUIT,
  MessageCreator.E_RECONNECT
]

export const useConnection = (cb)=>{

  const nav = useNavigate()
  const mContext = useContext(MessageContext)
  const roomControl = useContext(RoomContext)
  const tContext = useContext(ServerTimerContext)

  const setPlayer = (player) => {
    roomControl.setPlayer(player)
    mContext.setLoading(false)
    nav(LINK_PREPARE)
    localStorage.removeItem(S_LOST_ROOM)
    localStorage.removeItem(S_LOST_PLAYER)
  }
  const setError = (message) => {
    toast(message, {toastId:message})
    mContext.setError({visible: true,message})
    mContext.setLoading(false)
    localStorage.removeItem(S_LOST_ROOM)
    localStorage.removeItem(S_LOST_PLAYER)
  }

  const onMessage = (data) =>{
    if(roomEventTypes.includes(data.event))
      roomControl.setRoom(data.room)

    if(MessageCreator.E_ERROR === data.event)
      setError(data.message)
    if(MessageCreator.E_PLAYER_DATA === data.event)
      setPlayer(data.player)
    if(MessageCreator.E_TIMER === data.event)
      tContext.setTimer(data.timer)
  }

  const onClose = () => {
    setError("Сокет закрылся")
  }

  function connect() {
    mContext.setLoading(true)

    if(!Socket.getState(true) || Socket.getState(true) === "CLOSED")
        Socket.connect(cb, onMessage, onClose, localStorage.getItem(S_ACCESS_TOKEN))
    else{
        cb()
        console.log("Подключение уже существует")
    }
  }

  return connect
}