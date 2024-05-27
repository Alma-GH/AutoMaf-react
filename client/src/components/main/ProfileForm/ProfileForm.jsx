import React, {useState} from 'react';
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import InputC from "../../UI/InputC/InputC";
import cn from "./ProfileForm.module.scss"
import BtnText from "../../UI/BtnText/BtnText";
import {EM_NICK, S_NICK, T_NICK} from "../../../tools/const";
import {toast} from "react-toastify";

const ProfileForm = ({continueCB}) => {
  const [name, setName] = useState(localStorage.getItem(S_NICK) || "")

  function enter(){
    if(!name.length){
      toast(EM_NICK, {toastId: T_NICK})
      return
    }

    localStorage.setItem(S_NICK, name)
    continueCB()
  }

  return (
    <div className={cn.container}>
      <AvatarPicker />
      <InputC
        placeholder="Введите ник..."
        val={name}
        setVal={setName}
        enterCB={enter}
      />
      <BtnText text="Продолжить" type="secondary" cb={enter}/>
    </div>
  );
};

export default ProfileForm;