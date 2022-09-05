import React, {useContext, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import Socket from "../../tools/Services/Socket";
import {MessageContext, RoomContext} from "../../context/contexts";
import {LINK_PREPARE, LINK_START, S_NICK} from "../../tools/const";
import {useNavigate} from "react-router-dom";
import {errorByTimer, setConnection} from "../../tools/func";
import Timer from "../../tools/Services/Timer";

const FindPage = () => {

  const nav = useNavigate()

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")

  const mContext = useContext(MessageContext)
  const roomControl = useContext(RoomContext)
  function connect(){
    setConnection(
      findRoom,
      roomControl.setRoom,
      player=>{
        roomControl.setPlayer(player)
        nav(LINK_PREPARE)
      },
      message=>{
        errorByTimer(mContext.setError, message,
          "finder", 3000)
      }
    )
  }

  function findRoom(){
    const message = {
      event: "find_room",

      nameFinder: localStorage.getItem(S_NICK),
      nameRoom: room,
      passRoom: pass
    }
    Socket.send(JSON.stringify(message));
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