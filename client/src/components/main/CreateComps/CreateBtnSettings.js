import React, {useContext} from 'react';
import clsWin from "../WindowInput/WindowInput.module.scss";
import imgS from "../../../assets/imgs/spanner.png";
import {errorByTimer} from "../../../tools/func";
import {EM_VERSION} from "../../../tools/const";
import {MessageContext} from "../../../context/contexts";

//TODO: create UI comp
const CreateBtnSettings = ({setOpenSettings}) => {

  const mContext = useContext(MessageContext)

  function throwMessage(){
    errorByTimer(mContext.setError, EM_VERSION, "settingsAlpha", 3000)
  }
  function openSettings(){
    setOpenSettings(true)
  }

  return (
    <button onClick={throwMessage} className={clsWin.settingsBtn}>
      Настройки игры
      <div className={clsWin.imgCont}>
        <img src={imgS} alt="Settings"/>
      </div>
    </button>
  );
};

export default CreateBtnSettings;