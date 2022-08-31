import React, {useEffect, useState} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import {useNavigate} from "react-router-dom";
import {LINK_START} from "../../tools/const";

const EnterPage = () => {

  const nav = useNavigate()
  const [name, setName] = useState("")

  function enter(){
    //validate
    if(name.length < 4){
      //TODO: error
      // return
    }
    //TODO: "nick" - constant key
    localStorage.setItem("nick", name)
    setName("")
    nav(LINK_START)
  }

  useEffect(()=>{
    const nick = localStorage.getItem("nick")
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
        />
        <BtnText text="Войти" cb={enter}/>
      </div>
    </div>
  );
};

export default EnterPage;