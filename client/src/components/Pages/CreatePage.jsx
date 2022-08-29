import React, {useContext, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss";
import InputC from "../UI/InputC/InputC";
import BtnText from "../UI/BtnText/BtnText";
import imgS from "./../../assets/imgs/spanner.png"
import CheckboxC from "../UI/CheckboxC/CheckboxC";
import Socket from "../../tools/Services/Socket";
import {RoomContext} from "../../context/room";

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

  const [openSettings, setOpenSettings] = useState(false)

  const [addPass, setAddPass] = useState([
    {name:"Добавить пароль", value: false}
  ])

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")
  const [numPlayers, setNumPlayers] = useState("")

  const op = addPass[0].value

  const roomControl = useContext(RoomContext)
  function connect() {
    if(!Socket.getState(true))
      Socket.connect(create, data=>{
        if(!data.event)
          roomControl.setRoom(data)
        if(["create_room","find_room"].includes(data.event))
          roomControl.setPlayer(data.player)
      })
    else{
      create()
      console.log("Подключение уже существует")
    }
  }

  function create(){
    const message = {
      event: "create_room",

      nameCreator: localStorage.getItem("nick"),

      nameRoom: room,
      existPassword: false,
      password: "",
      numPlayers: +numPlayers,

      gameOptions:{}
    }
    Socket.send(JSON.stringify(message));
    setRoom("")
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
          <BtnText text="Назад" color="red"/>
          <BtnText text="Создать" cb={connect}/>
        </div>

      </WindowInput>
    </div>
  );
};

export default CreatePage;