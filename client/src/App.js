import "./style/App.scss"
import StartPage from "./components/Pages/StartPage";
import EnterPage from "./components/Pages/EnterPage";
import FindPage from "./components/Pages/FindPage";
import CreatePage from "./components/Pages/CreatePage";
import PreparePage from "./components/Pages/PreparePage";
import GamePage from "./components/Pages/GamePage";
import {RoomContext} from "./context/room";
import {useEffect, useState} from "react";
import Debug from "./components/Debug";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {
  LINK_PREPARE, LINK_START,
  PATH_CREATE,
  PATH_ENTER,
  PATH_FIND, PATH_GAME,
  PATH_PREPARE,
  PATH_ROOT_APP,
  PATH_ROOT_ROOM,
  PATH_START
} from "./tools/const";
import Socket from "./tools/Services/Socket";



function App() {

  const debug = true

  const [room, setRoom] = useState(null)

  const [player, setPlayer] = useState(null)


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
        <div className="App">
          <Routes>
            <Route path={PATH_ROOT_APP}>

              <Route path={PATH_ENTER} element={<EnterPage/>}/>
              <Route path={PATH_START} element={<StartPage/>}/>
              <Route path={PATH_CREATE} element={<CreatePage/>}/>
              <Route path={PATH_FIND} element={<FindPage/>}/>

              <Route path={PATH_ROOT_ROOM}>
                <Route path={PATH_PREPARE} element={<PreparePage/>}/>
                <Route path={PATH_GAME} element={<GamePage/>}/>
              </Route>

            </Route>
          </Routes>

          {debug && <Debug/>}
        </div>
      </RoomContext.Provider>
    </BrowserRouter>
  );
}

export default App;


