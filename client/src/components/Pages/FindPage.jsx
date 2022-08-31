import React, {useContext, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import Socket from "../../tools/Services/Socket";
import {RoomContext} from "../../context/room";
import {LINK_PREPARE, LINK_START} from "../../tools/const";
import {useNavigate} from "react-router-dom";

const FindPage = () => {

  const nav = useNavigate()

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")

  const roomControl = useContext(RoomContext)
  function connect(){
    if(!Socket.getState(true))
      Socket.connect(findRoom, data=>{
        if(!data.event)
          roomControl.setRoom(data)
        if(["create_room","find_room"].includes(data.event))
          roomControl.setPlayer(data.player)
      })
    else{
      findRoom()
      console.log("Подключение уже существует")
    }

  }

  function findRoom(){
    const message = {
      event: "find_room",

      nameFinder: localStorage.getItem("nick"),
      nameRoom: room,
      passRoom: pass
    }
    Socket.send(JSON.stringify(message));
    setRoom("")
    nav(LINK_PREPARE)
  }

  function back(){
    nav(LINK_START)
  }

  return (
    <div className="prepPage">

      <h1>Найти комнату</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <div className={clsWin.thinCont}>
            <InputC
              placeholder="Название комнаты"
              val={room}
              setVal={setRoom}
            />
            <InputC
              placeholder="Пароль"
              val={pass}
              setVal={setPass}
            />
          </div>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red" cb={back}/>
          <BtnText text="Войти" cb={connect}/>
        </div>

      </WindowInput>
    </div>
  );
};

export default FindPage;