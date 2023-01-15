import React, {useContext, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss";
import InputC from "../UI/InputC/InputC";
import BtnText from "../UI/BtnText/BtnText";
import Socket from "../../tools/Services/Socket";
import {useNavigate} from "react-router-dom";
import {DEFAULT_NAME, LINK_START, S_NICK} from "../../tools/const";
import MessageCreator from "../../tools/Services/MessageCreator";
import CreateAddPass from "../main/CreateComps/CreateAddPass";
import CreateBtnSettings from "../main/CreateComps/CreateBtnSettings";
import CreateSettings from "../main/CreateComps/CreateSettings";
import {useConnection} from "../../hooks/useConnection";
import {MessageContext, SettingsContext} from "../../context/contexts";
import Loader from "../Notification/Loader";


const CreatePage = () => {

  const nav = useNavigate()
  const mContext = useContext(MessageContext)
  const sContext = useContext(SettingsContext)

  const isLoad = mContext.loading
  const options = sContext.settings

  const [openSettings, setOpenSettings] = useState(false)

  const [addPass, setAddPass] = useState([
    {name:"Добавить пароль", value: false}
  ])

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")
  const [numPlayers, setNumPlayers] = useState("")

  const connect = useConnection(create, "leader")

  const op = addPass[0].value



  function create(){

    const name = localStorage.getItem(S_NICK) || DEFAULT_NAME
    const message = MessageCreator.createRoom(name, room, +numPlayers, op, pass, options)

    Socket.send(JSON.stringify(message));
  }

  function back(){
    nav(LINK_START)
  }


  if(openSettings)
    return <CreateSettings setOpenSettings={setOpenSettings}/>

  return (
    <div className="prepPage">
      <h1>Создать комнату</h1>

      <WindowInput>
        {!isLoad
          ? <>
            <div className={clsWin.inputCont}>
              <InputC
                placeholder="Название комнаты"
                val={room}
                setVal={setRoom}
              />

              <CreateAddPass
                pass={pass}
                setPass={setPass}
                addPass={addPass}
                setAddPass={setAddPass}
                op={op}
              />

              <InputC
                placeholder="Игроков"
                val={numPlayers}
                setVal={setNumPlayers}
              />

              <CreateBtnSettings setOpenSettings={setOpenSettings}/>
            </div>

            <div className={clsWin.btnCont}>
              <BtnText text="Назад" color="red" cb={back}/>
              <BtnText text="Создать" cb={connect}/>
            </div>
            </>

          : <Loader/>
        }
      </WindowInput>
    </div>
  );
};

export default CreatePage;