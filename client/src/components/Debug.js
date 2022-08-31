import React, {useContext, useState} from 'react';
import {RoomContext} from "../context/room";
import Socket from "../tools/Services/Socket";
import {useNavigate} from "react-router-dom";
import {LINK_CREATE, LINK_ENTER, LINK_FIND, LINK_GAME, LINK_PREPARE, LINK_START} from "../tools/const";

const Debug = () => {

  const [vis, setVis] = useState(true)

  const [create, setCreate] = useState("room")
  const [find, setFind] = useState("room")

  const nav = useNavigate()

  const context = useContext(RoomContext)
  const room    = context.room
  const player  = context.player

  const styleCont = {
    height: "100vh",
    width: "calc(30vw + 30px)",
    position:"fixed",
    right: vis ? "0" : "-30vw",
    top: "0",
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

  function getRoomData(){
    return JSON.stringify(room,null,2)
  }



  //test
  const max = 4
  function connect() {
    if(!Socket.getState(true))
      Socket.connect(createRoom, data=>{
        if(!data.event)
          context.setRoom(data)
        if(["create_room","find_room"].includes(data.event))
          context.setPlayer(data.player)
      })
    else{
      createRoom()
      console.log("Подключение уже существует")
    }
  }
  function createRoom(){
    const message = {
      event: "create_room",

      nameCreator: "Leader",

      nameRoom: create,
      existPassword: false,
      password: "",
      numPlayers: max,

      gameOptions:{}
    }
    Socket.send(JSON.stringify(message));
  }

  function connect2(){
    if(!Socket.getState(true))
      Socket.connect(findRoom, data=>{
        if(!data.event)
          context.setRoom(data)
        if(["create_room","find_room"].includes(data.event))
          context.setPlayer(data.player)
      })
    else{
      findRoom()
      console.log("Подключение уже существует")
    }

  }
  function findRoom(){
    const message = {
      event: "find_room",

      nameFinder: "Finder" + new Date().getSeconds(),
      nameRoom: find,
      passRoom: ""
    }
    Socket.send(JSON.stringify(message));
  }

  function startGame(){
    //TODO: message creator in Socket
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

  return (
    <div style={styleCont}>

      <button style={styleBtn} onClick={()=>setVis(prev=>!prev)}>X</button>

      <div style={styleBody}>

        {/*DATA*/}
        <div style={{display:"flex"}}>
          <div >
            <h5>ROOM:</h5>
            <textarea
              value={getRoomData()}
              readOnly
              style={{fontSize:"12px"}}
              cols="30"
              rows="20"
            />
          </div>

          <div>
            <h5>PLAYER:</h5>
            <textarea
              value={JSON.stringify(player)}
              readOnly
              cols="30"
              rows="1"
            />
          </div>
        </div>

        {/*POST*/}
        <div>
          <h5>POST:</h5>
          <ul>
            <li>
              <input type="text" value={create} onChange={e=>setCreate(e.target.value)}/>
              <button onClick={connect}>create</button>
            </li>
            <li>
              <input type="text" value={find} onChange={e=>setFind(e.target.value)}/>
              <button onClick={connect2}>find</button>
            </li>
            <li>
              <button onClick={startGame}>start</button>
            </li>
            <li>
              <button onClick={allChoose}>all choose</button>
            </li>
            <li>
              <button onClick={allReady}>all ready</button>
            </li>
          </ul>
        </div>

        {/*ROUTES*/}
        <div>
          <h5>ROUTES:</h5>
          <ul>
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