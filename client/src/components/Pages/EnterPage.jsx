import React, {useState} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";
import {useNavigate} from "react-router-dom";
import {EM_NICK, LINK_START, S_NICK, T_NICK} from "../../tools/const";
import {toast} from "react-toastify";
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import AvatarPicker from "../main/AvatarPicker/AvatarPicker";

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
      <Header />

      <MainCard addCls="inputCont">
        <AvatarPicker />
        <InputC
          placeholder="Введите ник..."
          val={name}
          setVal={setName}
          enterCB={enter}
        />
        <BtnText text="Войти" type="secondary" cb={enter}/>
      </MainCard>
    </div>
  );
};

export default EnterPage;