import React, {useContext, useEffect, useState} from 'react';
import {RoomContext, ServerTimerContext, SettingsContext} from "../context/contexts";
import Socket from "../tools/Services/Socket";
import {useNavigate} from "react-router-dom";
import {
  LINK_CREATE,
  LINK_ENTER,
  LINK_FIND,
  LINK_GAME,
  LINK_PREPARE,
  LINK_START,
  S_VOTE_TYPE_CLASSIC, S_VOTE_TYPE_REALTIME
} from "../tools/const";
import GameService from "../tools/Services/GameService";
import MessageCreator from "../tools/Services/MessageCreator";
import {useConnection} from "../hooks/useConnection";

const styleCont = {
  height: "100vh",
  width: "calc(30vw + 30px)",
  position:"fixed",
  top: "0",
  zIndex: 1000,
  border:"1px solid red"
}
const styleBody = {
  height: "100vh",
  width: "30vw",
  position:"absolute",
  right:"0",
  top:"0",
  backgroundColor: "white",
}
const styleBtn = {
  height: "30px",
  width: "30px"
}

const Debug = () => {

  const [vis, setVis] = useState(true)

  const [create, setCreate] = useState("room")
  const [find, setFind] = useState("room")
  const [votes, setVotes] = useState("")

  const [voteType, setVoteType] = useState("")

  const nav = useNavigate()

  const context = useContext(RoomContext)
  const sContext = useContext(SettingsContext)
  const timer = useContext(ServerTimerContext).timer
  const room    = context.room
  const player  = context.player


  function getRoomData(){
    return JSON.stringify(room,null,2)
  }

  const connect1 = useConnection(createRoom, "finder")
  const connect2 = useConnection(findRoom, "finder")

  //test
  const max = 8

  function createRoom(){
    if(room)
      return

    const message = {
      event: "create_room",

      nameCreator: "Leader",

      nameRoom: create,
      existPassword: false,
      password: "",
      numPlayers: max,

      gameOptions: sContext.settings
    }
    Socket.send(JSON.stringify(message));
  }

  function findRoom(){
    if(room)
      return

    const message = {
      event: "find_room",

      nameFinder: "Finder" + new Date().getSeconds(),
      nameRoom: find,
      passRoom: ""
    }
    Socket.send(JSON.stringify(message));
  }

  function startGame(){
    const message = {
      event: "start_game",

      roomID: room.roomID
    }

    Socket.send(JSON.stringify(message))
  }

  function allChoose(){

    const players = room.players

    const messages = players.map((player,ind)=>{
      return {
        event: "choose_card",

        roomID: room.roomID,

        idPlayer: player._id,
        cardIndex: ind,
      }
    })

    messages.forEach(message=>{
      Socket.send(JSON.stringify(message))
    })
  }

  function allReady(){

    const players = room.players

    const messages = players.map((player,ind)=>{
      return {
        event: "readiness",

        roomID: room.roomID,

        idPlayer: player._id,
      }
    })

    messages.forEach(message=>{
      Socket.send(JSON.stringify(message))
    })
  }

  function autoSubVote(){

    const game = GameService.getGame(room)

    const players = GameService.getPlayersAlive(game)
    const sus = players[0]
    const nextSus = players.find(pl=>pl._id!==sus._id)

    const speaker = GameService.getPlayers(game).find(player=>player.speak)

    const message = MessageCreator
        .vote(room.roomID,speaker._id, sus._id===speaker._id ? nextSus._id : sus._id)

    Socket.send(JSON.stringify(message))
  }

  function autoVote(){

    const game = GameService.getGame(room)

    const alive = GameService.getPlayersAlive(game)

    const voters = alive
      .filter(pl=>(!pl.judged && pl.vote===null) || game.options.voteType === "VOTE_TYPE_REALTIME")
    const sus = alive.find(pl=>pl.judged || game.options.voteType === "VOTE_TYPE_REALTIME")
    const nextSus = alive.find(pl=>pl._id!==sus._id)

    voters.forEach(voter=>{
      const message = MessageCreator
        .vote(room.roomID,voter._id, sus._id===voter._id ? nextSus._id : sus._id)

      Socket.send(JSON.stringify(message))
    })
  }

  function autoNightVote(){

    const game = GameService.getGame(room)

    const alive = GameService.getPlayersAlive(game)
    const voters = alive
      .filter(pl=>GameService.isPlayerToMatchNightPhase(pl,game))
    const sus = alive
      .find(pl=>!GameService.isPlayerToMatchNightPhase(pl,game))

    voters.forEach(voter=>{
      const message = MessageCreator
        .voteNight(room.roomID,voter._id, sus._id)

      Socket.send(JSON.stringify(message))
    })
  }

  function vote(){
    const map = {}

    const separators = ["\n", " ", ";"]
    const voteStrings = []
    let voteStr = ""

    for(let char of votes){
      if(separators.includes(char)){
        if(voteStr.length !== 0)
          voteStrings.push(voteStr)
        voteStr = ""
        continue
      }
      voteStr += char
    }
    if(voteStr.length){
      voteStrings.push(voteStr)
    }

    for(let vote of voteStrings){
      map[vote[0]] = vote[2]
    }


    for(let key of Object.keys(map)){
      const val = map[key]

      const message = MessageCreator
        .vote(room.roomID, +key, +val)

      Socket.send(JSON.stringify(message))
    }

  }

  function setSettings(){
    const message = MessageCreator.setSettings(GameService.getRoomID(room), voteType)
    Socket.send(JSON.stringify(message))
  }

  useEffect(()=>{

    document.addEventListener("keydown", (e)=>{

      if(e.ctrlKey){
        e.preventDefault()
        switch (e.key){
          case "1":
            connect1()
            break;
          case "2":
            connect2()
            break;
          case "3":
            allReady()
            break;
        }
      }
    })

  }, [room])

  const roomDATA = getRoomData()
  const playerDATA = JSON.stringify(player)
  const timerDATA = JSON.stringify(timer,null,2)
  return (
    <div style={{...styleCont, right: vis ? "0" : "-30vw",}}>

      <button style={styleBtn} onClick={()=>setVis(prev=>!prev)}>X</button>

      <div style={styleBody}>

        {/*DATA*/}
        <div style={{display:"flex"}}>
          <div >
            <h5>ROOM:</h5>
            <textarea
              value={roomDATA ? roomDATA : "null"}
              readOnly
              style={{fontSize:"12px"}}
              cols="30"
              rows="20"
            />
          </div>

          <div>
            <h5>PLAYER:</h5>
            <textarea
              value={playerDATA ? playerDATA : "null"}
              readOnly
              cols="30"
              rows="1"
            />

            <h5>TIMER:</h5>
            <textarea
              value={timerDATA!==null ? timerDATA : "null"}
              readOnly
              cols="30"
              rows="4"
            />
          </div>
        </div>

        {/*POST*/}
        <div>
          <h5>POST:</h5>
          <ul>
            <li>
              <input type="text" value={create} onChange={e=>setCreate(e.target.value)}/>
              <button onClick={connect1}>create</button>
            </li>
            <li>
              <input type="text" value={find} onChange={e=>setFind(e.target.value)}/>
              <button onClick={connect2}>find</button>
            </li>
            <li>
              <ul style={{display:"flex"}}>
                <li><button onClick={startGame}>start</button></li>
                <li><button onClick={allChoose}>all choose</button></li>
              </ul>
              <ul style={{display:"flex"}}>
                <li><button onClick={allReady}>all ready</button></li>
                <li><button onClick={autoNightVote}>auto night vote</button></li>
                <li><button onClick={autoSubVote}>auto sub vote</button></li>
                <li><button onClick={autoVote}>auto vote</button></li>
              </ul>
            </li>
            <li>
              <textarea value={votes} onChange={e=>setVotes(e.target.value)}/>
              <button onClick={vote}>vote</button>
            </li>
            <li>
              <input
                type="text" placeholder="vote type"
                value={voteType} onChange={e=>setVoteType(e.target.value)}
              />
              <button onClick={setSettings}>settings</button>
            </li>
          </ul>
        </div>

        {/*ROUTES*/}
        <div>
          <h5>ROUTES:</h5>
          <ul style={{display:"flex"}}>
            <li>
              <button onClick={()=>nav(LINK_ENTER)}>enter</button>
            </li>
            <li>
              <button onClick={()=>nav(LINK_START)}>start</button>
            </li>
            <li>
              <button onClick={()=>nav(LINK_CREATE)}>create</button>
            </li>
            <li>
              <button onClick={()=>nav(LINK_FIND)}>find</button>
            </li>
            <li>
              <button onClick={()=>nav(LINK_PREPARE)}>prepare</button>
            </li>
            <li>
              <button onClick={()=>nav(LINK_GAME)}>game</button>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Debug;