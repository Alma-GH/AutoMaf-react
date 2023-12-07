import React, {useContext, useEffect, useState} from 'react';
import {S_LOST_PLAYER, S_LOST_ROOM} from "../tools/const";
import BtnText from "./UI/BtnText/BtnText";
import {useConnection} from "../hooks/useConnection";
import MessageCreator from "../tools/Services/MessageCreator";
import Socket from "../tools/Services/Socket";
import {MessageContext, RoomContext} from "../context/contexts";


function checkStorage(){
  const roomID = localStorage.getItem(S_LOST_ROOM)
  const playerID = localStorage.getItem(S_LOST_PLAYER)

  return roomID!==null && playerID!==null
}

const Reconnect = () => {

  const rContext = useContext(RoomContext)
  const mContext = useContext(MessageContext)

  const [vis, setVis] = useState(checkStorage())

  const connect = useConnection(reconnect, "reconnect")

  function reconnect(){

    const message = MessageCreator.reconnect(
      localStorage.getItem(S_LOST_ROOM),
      localStorage.getItem(S_LOST_PLAYER)
    )

    Socket.send(JSON.stringify(message))
  }

  useEffect(() => {
    function checkData() {
      setVis(checkStorage())
    }

    window.addEventListener('storage', checkData)

    return () => {
      window.removeEventListener('storage', checkData)
    }
  }, [])

  useEffect(()=>{
    setVis(checkStorage())
  }, [rContext.player, mContext.error])

  if(!vis)
    return

  return (
    <div className="reconnectBtn">
      <BtnText text="Обратно" color="yellow" cb={connect}/>
    </div>
  );
};

export default Reconnect;