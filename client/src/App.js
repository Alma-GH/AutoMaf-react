import "./style/App.scss"
import {CardContext, MessageContext, RoomContext, ServerTimerContext, SettingsContext} from "./context/contexts";
import React, {useEffect, useState} from "react";
import Debug from "./components/Debug";
import {BrowserRouter} from "react-router-dom";
import Socket from "./tools/Services/Socket";
import ErrorMessage from "./components/Notification/ErrorMessage";
import AppRouter from "./components/AppRouter";
import MessageCreator from "./tools/Services/MessageCreator";
import GameService from "./tools/Services/GameService";
import {DEBUG_LOG, DEF_ERROR, DEF_SETTINGS, S_LOST_PLAYER, S_LOST_ROOM, S_PLAYER_ID} from "./tools/const";
import Reconnect from "./components/Reconnect";
import ModalAlert from "./components/UI/Modal/ModalAlert";


function App() {

  let [room, setRoom] = useState(null)
  let [player, setPlayer] = useState(null)


  const [timer, setTimer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(DEF_ERROR)

  const [visCard, setVisCard] = useState(false);
  const [settings, setSettings] = useState(DEF_SETTINGS);

  useEffect(()=>{
    if(room && player){
      const id = GameService.getRoomID(room) + "_" + GameService.getID(player)
      localStorage.setItem(S_PLAYER_ID,id)
    }
  }, [room, player])

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
    <BrowserRouter>
      <RoomContext.Provider value={{room,setRoom, player,setPlayer}} >
        <MessageContext.Provider value={{error,setError, loading,setLoading}}>
          <ServerTimerContext.Provider value={{timer, setTimer}}>
            <CardContext.Provider value={{visCard,setVisCard}}>
              <SettingsContext.Provider value={{settings, setSettings}}>
                <div className="App">
                  <AppRouter/>
                  {DEBUG_LOG && <Debug/>}
                  <ErrorMessage {...error}/>
                  <Reconnect/>
                </div>
              </SettingsContext.Provider>
            </CardContext.Provider>
          </ServerTimerContext.Provider>
        </MessageContext.Provider>
      </RoomContext.Provider>
    </BrowserRouter>
  );
}

export default App;
