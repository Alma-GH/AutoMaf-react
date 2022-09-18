import React from 'react';
import clsWin from "../WindowInput/WindowInput.module.scss";
import imgS from "../../../assets/imgs/spanner.png";

//TODO: create UI comp
const CreateBtnSettings = ({setOpenSettings}) => {
  return (
    <button onClick={()=>setOpenSettings(true)} className={clsWin.settingsBtn}>
      Настройки игры
      <div className={clsWin.imgCont}>
        <img src={imgS} alt="Settings"/>
      </div>
    </button>
  );
};

export default CreateBtnSettings;