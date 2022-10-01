import React, {useContext} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import {useNavigate} from "react-router-dom";
import {EM_VERSION, LINK_CREATE, LINK_ENTER, LINK_FIND} from "../../tools/const";
import {errorByTimer} from "../../tools/func";
import {MessageContext} from "../../context/contexts";

const StartPage = () => {

  const nav = useNavigate()
  const mContext = useContext(MessageContext)


  function getNav(link){
    return ()=>nav(link)
  }
  function throwMessage(){
    errorByTimer(mContext.setError, EM_VERSION,  "rulesAlpha",3000)
  }

  return (
    <div className="startPage">
      <div className="btnCont">
        <BtnText text="Найти" cb={getNav(LINK_FIND)}/>
        <BtnText text="Создать" cb={getNav(LINK_CREATE)}/>
        <BtnText text="Правила" cb={throwMessage}/>
        <BtnText text="Имя" color="red" cb={getNav(LINK_ENTER)}/>
      </div>
    </div>

  );
};

export default StartPage;