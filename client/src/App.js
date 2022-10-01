import "./style/App.scss"
import {CardContext, MessageContext, RoomContext, ServerTimerContext} from "./context/contexts";
import {useEffect, useState} from "react";
import Debug from "./components/Debug";
import {BrowserRouter} from "react-router-dom";
import Socket from "./tools/Services/Socket";
import ErrorMessage from "./components/Notification/ErrorMessage";
import AppRouter from "./components/AppRouter";
import MessageCreator from "./tools/Services/MessageCreator";
import GameService from "./tools/Services/GameService";
import {DEBUG_LOG} from "./tools/const";


function App() {

  let [room, setRoom] = useState(null)
  let [player, setPlayer] = useState(null)


  const [timer, setTimer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({
    visible: false,
    message: ""
  })

  const [visCard, setVisCard] = useState(false);

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
      if(Socket.websocket && room && player)
        quit()
    }

  },[room, player])

  return (
    <BrowserRouter>
      <RoomContext.Provider value={{room,setRoom, player,setPlayer}} >
        <MessageContext.Provider value={{error,setError, loading,setLoading}}>
          <ServerTimerContext.Provider value={{timer, setTimer}}>
            <CardContext.Provider value={{visCard,setVisCard}}>
              <div className="App">
                <AppRouter/>
                {DEBUG_LOG && <Debug/>}
                <ErrorMessage {...error}/>
              </div>
            </CardContext.Provider>
          </ServerTimerContext.Provider>
        </MessageContext.Provider>
      </RoomContext.Provider>
    </BrowserRouter>
  );
}

export default App;
