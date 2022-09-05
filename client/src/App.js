import "./style/App.scss"
import {MessageContext, RoomContext} from "./context/contexts";
import {useEffect, useState} from "react";
import Debug from "./components/Debug";
import {BrowserRouter} from "react-router-dom";
import Socket from "./tools/Services/Socket";
import ErrorMessage from "./components/Notification/ErrorMessage";
import AppRouter from "./components/AppRouter";


function App() {

  const debug = true

  const [room, setRoom] = useState(null)
  const [player, setPlayer] = useState(null)

  const [error, setError] = useState({
    visible: false,
    message: ""
  })

  useEffect(()=>{

    function quit(){
      const message = {
        event: "quit_player",

        roomID: room.roomID,

        idPlayer: player._id
      }

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

  },[room])


  return (
    <BrowserRouter>
      <RoomContext.Provider value={{room,setRoom, player,setPlayer}} >
        <MessageContext.Provider value={{error,setError}}>
          <div className="App">
            <AppRouter/>
            {debug && <Debug/>}
            <ErrorMessage {...error}/>
          </div>
        </MessageContext.Provider>
      </RoomContext.Provider>
    </BrowserRouter>
  );
}

export default App;


