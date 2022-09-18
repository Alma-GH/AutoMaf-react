import "./style/App.scss"
import {MessageContext, RoomContext} from "./context/contexts";
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

  const [room, setRoom] = useState(null)
  const [player, setPlayer] = useState(null)

  const [error, setError] = useState({
    visible: false,
    message: ""
  })

  useEffect(()=>{

    function quit(){
      const rID = GameService.getRoomID(room)
      const pID = GameService.getID(player)
      const message = MessageCreator.quit(rID, pID)

      Socket.send(JSON.stringify(message))
    }

    window.onbeforeunload = ()=>{
      if(Socket.websocket && room)
        return "Вы точно хотите выйти?"
    }

    window.onunload = ()=>{
      if(Socket.websocket && room && player)
        quit()
    }

  },[room, player])


  return (
    <BrowserRouter>
      <RoomContext.Provider value={{room,setRoom, player,setPlayer}} >
        <MessageContext.Provider value={{error,setError}}>
          <div className="App">
            <AppRouter/>
            {DEBUG_LOG && <Debug/>}
            <ErrorMessage {...error}/>
          </div>
        </MessageContext.Provider>
      </RoomContext.Provider>
    </BrowserRouter>
  );
}

export default App;
