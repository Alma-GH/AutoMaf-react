import React, {useEffect, useRef, useState} from 'react';
import MessageCreator from "../tools/Services/MessageCreator";

const WebSocketTest = () => {
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
    const message = MessageCreator.createRoom(inp,1,4)

    socket.current.send(JSON.stringify(message));
    setInp("")
  }

  function findRoom(){
    const message = MessageCreator.findRoom(inp, "For my friends",)

    socket.current.send(JSON.stringify(message));
    setInp("")
  }

  function startGame(){
    const message = MessageCreator.startGame(0)

    socket.current.send(JSON.stringify(message))
  }

  function chooseCard(){
    const message = MessageCreator.chooseCard(0, player._id, +inp)

    socket.current.send(JSON.stringify(message))
    setInp("")
  }

  function readiness(){
    const message = MessageCreator.readiness(0, player._id)

    socket.current.send(JSON.stringify(message))
  }

  function voteKill(){
    const message = MessageCreator.voteNight(0,player._id,+inp)

    socket.current.send(JSON.stringify(message))
  }

  function vote(){
    const message = MessageCreator.vote(0,player._id,+inp)

    socket.current.send(JSON.stringify(message))
  }

  function nextJudged(){
    const message = {
      event: "next_judged",

      roomID: 0,
    }

    socket.current.send(JSON.stringify(message))
  }

  function quit(){
    const message = MessageCreator.quit(0,player._id)

    socket.current.send(JSON.stringify(message))
  }

  useEffect(()=>{
    connect()
  }, [])

  return (
    <div>
      <button onClick={createRoom}>create room</button>
      <button onClick={findRoom}>find room</button>
      <button onClick={startGame}>start game</button>
      <button onClick={chooseCard}>choose card</button>
      <button onClick={readiness}>ready</button>
      <button onClick={voteKill}>vote kill</button>
      <button onClick={vote}>vote</button>
      <button onClick={nextJudged}>next judged</button>
      <button onClick={quit}>quit</button>
      <input type="text" onChange={e=>setInp(e.target.value)} value={inp}/>
    </div>
  )
};

export default WebSocketTest;