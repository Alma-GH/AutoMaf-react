import React, {useContext, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import Socket from "../../tools/Services/Socket";
import {DEFAULT_NAME, LINK_START, S_NICK} from "../../tools/const";
import {useNavigate} from "react-router-dom";
import MessageCreator from "../../tools/Services/MessageCreator";
import {useConnection} from "../../hooks/useConnection";
import {MessageContext} from "../../context/contexts";
import Loader from "../Notification/Loader";


const FindPage = () => {

  const nav = useNavigate()
  const mContext = useContext(MessageContext)
  const isLoad = mContext.loading

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")


  const connect = useConnection(findRoom, "finder")

  function findRoom(){
    const name = localStorage.getItem(S_NICK) || DEFAULT_NAME
    const message = MessageCreator.findRoom(name, room, pass)

    Socket.send(JSON.stringify(message));
    setPass("")
  }

  function back(){
    nav(LINK_START)
  }

  return (
    <div className="prepPage">

      <h1>Найти комнату</h1>

      <WindowInput>
        {!isLoad
          ? <>
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
            </>

          : <Loader/>
        }
      </WindowInput>
    </div>
  );
};

export default FindPage;