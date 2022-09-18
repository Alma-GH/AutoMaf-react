import React from 'react';
import WindowInput from "../WindowInput/WindowInput";
import clsWin from "../WindowInput/WindowInput.module.scss";
import BtnText from "../../UI/BtnText/BtnText";

const CreateSettings = ({setOpenSettings}) => {

  return (
    <div className="prepPage">
      <h1>Создать комнату</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          SETTINGS
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red" cb={()=>setOpenSettings(false)}/>
        </div>

      </WindowInput>
    </div>
  );
};

export default CreateSettings;