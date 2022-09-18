import React, {useContext, useEffect, useState} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import {useNavigate} from "react-router-dom";
import {LINK_START, S_NICK} from "../../tools/const";
import {MessageContext} from "../../context/contexts";
import {errorByTimer} from "../../tools/func";

const EnterPage = () => {

  const nav = useNavigate()
  const [name, setName] = useState("")

  const mContext = useContext(MessageContext)

  function enter(){
    //validate
    if(!name.length){
      errorByTimer(mContext.setError, "Введите ник",
        "enter nick", 3000)
      return
    }

    localStorage.setItem(S_NICK, name)
    setName("")
    nav(LINK_START)
  }

  useEffect(()=>{
    const nick = localStorage.getItem(S_NICK)
    if(nick)
      setName(nick)
  }, [])


  return (
    <div className="enterPage">
      <div className="inputCont">
        <InputC
                placeholder="Ваше имя"
                val={name}
                setVal={setName}
                enterCB={enter}
        />
        <BtnText text="Войти" cb={enter}/>
      </div>
    </div>
  );
};

export default EnterPage;