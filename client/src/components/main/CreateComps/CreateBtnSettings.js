import React, {useContext} from 'react';
import clsWin from "../WindowInput/WindowInput.module.scss";
import imgS from "../../../assets/imgs/spanner.png";
import {errorByTimer} from "../../../tools/func";
import {EM_VERSION} from "../../../tools/const";
import {MessageContext, RoomContext} from "../../../context/contexts";
import GameService from "../../../tools/Services/GameService";

//TODO: create UI comp
const CreateBtnSettings = ({setOpenSettings}) => {

  const mContext = useContext(MessageContext)
  const rContext = useContext(RoomContext)

  const room = rContext?.room
  const player = rContext?.player

  const players = GameService.getMembers(room)



  function throwMessage(){
    errorByTimer(mContext.setError, EM_VERSION, "settingsAlpha", 3000)
  }
  function openSettings(){
    setOpenSettings(true)
  }

  return (
    <button onClick={openSettings} className={clsWin.settingsBtn} disabled={!GameService.isLeader(player, players)}>
      Настройки игры
      <div className={clsWin.imgCont}>
        <img src={imgS} alt="Settings"/>
      </div>
    </button>
  );
};

export default CreateBtnSettings;