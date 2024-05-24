import React, {useEffect, useState} from 'react';
import {
  AvatarContext,
  CardContext,
  MessageContext,
  RoomContext,
  ServerTimerContext,
  SettingsContext
} from "../../context/contexts";
import {DEF_ERROR, DEF_SETTINGS, S_LOST_PLAYER, S_LOST_ROOM} from "../../tools/const";
import GameService from "../../tools/Services/GameService";
import MessageCreator from "../../tools/Services/MessageCreator";
import Socket from "../../tools/Services/Socket";
import {getRandomIntInclusive} from "../../tools/func";

const randomAvatar = getRandomIntInclusive(1,9)

const GlobalProvider = ({ children }) => {

  const [room, setRoom] = useState(null)
  const [player, setPlayer] = useState(null)


  const [timer, setTimer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(DEF_ERROR)

  const [visCard, setVisCard] = useState(false);
  const [settings, setSettings] = useState(DEF_SETTINGS);

  const [avatar, setAvatar] = useState(randomAvatar);

  useEffect(()=>{

    function quit(){
      const rID = GameService.getRoomID(room)
      const pID = GameService.getID(player)
      const message = MessageCreator.quit(rID, pID)

      Socket.send(JSON.stringify(message))
    }

    window.onbeforeunload = ()=>{
      if(Socket.websocket && room){
        return "Вы точно хотите выйти?"
      }
    }

    window.onunload = ()=>{
      if(Socket.websocket && player && room){
        // quit()
        if(GameService.getGame(room)){
          localStorage.setItem(S_LOST_ROOM, GameService.getRoomID(room))
          localStorage.setItem(S_LOST_PLAYER, GameService.getID(player))
        }else{
          quit()
        }
      }
    }

  },[room, player])

  return (
    <RoomContext.Provider value={{room,setRoom, player,setPlayer}} >
      <MessageContext.Provider value={{error,setError, loading,setLoading}}>
        <ServerTimerContext.Provider value={{timer, setTimer}}>
          <CardContext.Provider value={{visCard,setVisCard}}>
            <SettingsContext.Provider value={{settings, setSettings}}>
              <AvatarContext.Provider value={{avatar, setAvatar}}>
                {children}
              </AvatarContext.Provider>
            </SettingsContext.Provider>
          </CardContext.Provider>
        </ServerTimerContext.Provider>
      </MessageContext.Provider>
    </RoomContext.Provider>
  );
};

export default GlobalProvider;