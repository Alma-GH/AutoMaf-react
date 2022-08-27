import "./style/App.scss"
import StartPage from "./components/Pages/StartPage";
import EnterPage from "./components/Pages/EnterPage";
import FindPage from "./components/Pages/FindPage";
import CreatePage from "./components/Pages/CreatePage";
import PreparePage from "./components/Pages/PreparePage";
import GamePage from "./components/Pages/GamePage";
import {useEffect, useRef, useState} from "react";


function App() {

  const socket = useRef()
  const [inp, setInp] = useState("")
  const [player, setPlayer] = useState(null)

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      const message = {
        data: "onopen",
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))
      console.group("ONOPEN")
      console.log({message})
      console.groupEnd()
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if(["create_room","find_room"].includes(message.event))
        setPlayer(message.player)
      console.group("ONMESSAGE")
      console.log({message,game:message.game,players:message.game?.players})
      console.groupEnd()
    }
    socket.current.onclose= () => {
      console.log('Socket закрыт')
    }
    socket.current.onerror = () => {
      console.log('Socket произошла ошибка')
    }
  }

  function createRoom(){
    const message = {
      event: "create_room",

      nameCreator: inp,

      nameRoom: "For my friends",
      existPassword: false,
      password: "",
      numPlayers: 4,

      gameOptions:{}
    }
    socket.current.send(JSON.stringify(message));
    setInp("")
  }

  function findRoom(){
    const message = {
      event: "find_room",

      nameFinder: inp,
      nameRoom: "For my friends",
      passRoom: ""
    }
    socket.current.send(JSON.stringify(message));
    setInp("")
  }

  function startGame(){
    const message = {
      event: "start_game",

      roomID: 0
    }

    socket.current.send(JSON.stringify(message))
  }

  function chooseCard(){
    const message = {
      event: "choose_card",

      roomID: 0,

      idPlayer: player._id,
      cardIndex: +inp,
    }

    socket.current.send(JSON.stringify(message))
    setInp("")
  }

  function readiness(){
    const message = {
      event: "readiness",

      roomID: 0,

      idPlayer: player._id,
    }

    socket.current.send(JSON.stringify(message))
  }

  function voteKill(){
    const message = {
      event: "vote_night",

      roomID: 0,

      idVoter: player._id,
      idChosen: +inp,
    }

    socket.current.send(JSON.stringify(message))
  }

  function vote(){
    const message = {
      event: "vote",

      roomID: 0,

      idVoter: player._id,
      idChosen: +inp,
    }

    socket.current.send(JSON.stringify(message))
  }

  function nextJudged(){
    const message = {
      event: "next_judged",

      roomID: 0,
    }

    socket.current.send(JSON.stringify(message))
  }

  useEffect(()=>{
    connect()
  }, [])

  return (
    <div className="App">
      <button onClick={createRoom}>create room</button>
      <button onClick={findRoom}>find room</button>
      <button onClick={startGame}>start game</button>
      <button onClick={chooseCard}>choose card</button>
      <button onClick={readiness}>ready</button>
      <button onClick={voteKill}>vote kill</button>
      <button onClick={vote}>vote</button>
      <button onClick={nextJudged}>next judged</button>
      <input type="text" onChange={e=>setInp(e.target.value)} value={inp}/>
      <EnterPage/>
      <StartPage/>
      <FindPage/>
      <CreatePage/>
      <PreparePage/>
      <GamePage/>
    </div>
  );
}

export default App;
