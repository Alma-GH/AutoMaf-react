import "./style/App.scss"
import StartPage from "./components/Pages/StartPage";
import EnterPage from "./components/Pages/EnterPage";
import FindPage from "./components/Pages/FindPage";
import CreatePage from "./components/Pages/CreatePage";
import PreparePage from "./components/Pages/PreparePage";
import GamePage from "./components/Pages/GamePage";
import WebSocketTest from "./components/WebSocketTest";
import {RoomContext} from "./context/room";
import {useState} from "react";
import Debug from "./components/Debug";

function App() {

  const debug = true

  const [room, setRoom] = useState({
    players: [],
    maxPlayers: 0
  })

  const [player, setPlayer] = useState()

  return (
    <div className="App">
      <RoomContext.Provider value={{room,setRoom, player,setPlayer}} >
        <EnterPage/>
        <StartPage/>
        <FindPage/>
        <CreatePage/>
        <PreparePage/>
        <GamePage/>
        {debug && <Debug/>}
      </RoomContext.Provider>
    </div>
  );
}

export default App;


