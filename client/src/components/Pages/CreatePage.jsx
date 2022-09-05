import React, {useContext, useEffect, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss";
import InputC from "../UI/InputC/InputC";
import BtnText from "../UI/BtnText/BtnText";
import imgS from "./../../assets/imgs/spanner.png"
import CheckboxC from "../UI/CheckboxC/CheckboxC";
import Socket from "../../tools/Services/Socket";
import {MessageContext, RoomContext} from "../../context/contexts";
import {useNavigate} from "react-router-dom";
import {LINK_PREPARE, LINK_START, S_NICK} from "../../tools/const";
import {errorByTimer, setConnection} from "../../tools/func";
import Timer from "../../tools/Services/Timer";

const Settings = ({setOpenSettings}) => {

  return (
    <div className="prepPage">
      <h1>Создать комнату</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          SETTINGS
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red" cb={()=>setOpenSettings(false)}/>
        </div>

      </WindowInput>
    </div>
  );
}

const CreatePage = () => {

  const nav = useNavigate()

  const [openSettings, setOpenSettings] = useState(false)

  const [addPass, setAddPass] = useState([
    {name:"Добавить пароль", value: false}
  ])

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")
  const [numPlayers, setNumPlayers] = useState("")

  const op = addPass[0].value

  const mContext = useContext(MessageContext)
  const roomControl = useContext(RoomContext)
  function connect() {
    setConnection(
      create,
      roomControl.setRoom,
      player=>{
        roomControl.setPlayer(player)
        nav(LINK_PREPARE)
      },
      message=>{
        errorByTimer(mContext.setError, message,
          "leader", 3000)
      }
    )
  }

  function create(){
    const message = {
      event: "create_room",

      nameCreator: localStorage.getItem(S_NICK),

      nameRoom: room,
      existPassword: false,
      password: "",
      numPlayers: +numPlayers,

      gameOptions:{}
    }
    Socket.send(JSON.stringify(message));
  }

  function back(){
    nav(LINK_START)
  }


  if(openSettings)
    return <Settings setOpenSettings={setOpenSettings}/>

  return (
    <div className="prepPage">
      <h1>Создать комнату</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <InputC
            placeholder="Название комнаты"
            val={room}
            setVal={setRoom}
          />

          {/*union in component*/}
          <CheckboxC choices={addPass} setChoices={setAddPass}/>
          <div style={{ visibility: (op ? "visible" : "hidden") }}>
            <InputC
              placeholder="Пароль"
              val={pass}
              setVal={setPass}
            />
          </div>

          <InputC
            placeholder="Игроков"
            val={numPlayers}
            setVal={setNumPlayers}
          />

          <button onClick={()=>setOpenSettings(true)} className={clsWin.settingsBtn}>
            Настройки игры
            <div className={clsWin.imgCont}>
              <img src={imgS} alt="Settings"/>
            </div>
          </button>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red" cb={back}/>
          <BtnText text="Создать" cb={connect}/>
        </div>

      </WindowInput>
    </div>
  );
};

export default CreatePage;