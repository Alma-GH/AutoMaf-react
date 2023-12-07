import React, {useState} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import {useNavigate} from "react-router-dom";
import {EM_NICK, LINK_START, S_NICK, T_NICK} from "../../tools/const";
import {toast} from "react-toastify";

const EnterPage = () => {

  const nav = useNavigate()
  const [name, setName] = useState(localStorage.getItem(S_NICK))

  function enter(){
    if(!name.length){
      toast(EM_NICK, {toastId: T_NICK})
      return
    }

    localStorage.setItem(S_NICK, name)
    setName("")
    nav(LINK_START)
  }

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