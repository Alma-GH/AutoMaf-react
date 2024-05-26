import React, {useContext, useState} from 'react';
import InputC from "../../../UI/InputC/InputC";
import BtnText from "../../../UI/BtnText/BtnText";
import Loader from "../../../Notification/Loader";
import {AvatarContext, MessageContext, RoomContext, SettingsContext} from "../../../../context/contexts";
import {useNavigate} from "react-router-dom";
import {useConnection} from "../../../../hooks/useConnection";
import {DEFAULT_NAME, LINK_START, S_NICK} from "../../../../tools/const";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import Socket from "../../../../tools/Services/Socket";
import cn from "./CreateForm.module.scss"
import GameService from "../../../../tools/Services/GameService";
import BtnTextIco from "../../../UI/BtnTextIco/BtnTextIco";
import imgS from "../../../../assets/imgs/spanner.png";


const CreateForm = ({ setOpenSettings }) => {
  
  const nav = useNavigate()
  const rContext = useContext(RoomContext)
  const { loading } = useContext(MessageContext)
  const sContext = useContext(SettingsContext)
  const avatarContext = useContext(AvatarContext)

  const options = sContext.settings
  const avatar = avatarContext?.avatar


  const room = rContext?.room
  const player = rContext?.player
  const players = GameService.getMembers(room)
  const isLeader = GameService.isLeader(player, players)



  const [numPlayers, setNumPlayers] = useState("")

  const connect = useConnection(create)



  function create(){

    const name = localStorage.getItem(S_NICK) || DEFAULT_NAME
    const message = MessageCreator.createRoom(name, avatar, +numPlayers, options)

    Socket.send(JSON.stringify(message));
  }

  function back(){
    nav(LINK_START)
  }


  const openSettings = () => setOpenSettings(true)
  
  if(loading)
    return <Loader />
  
  return (
    <div className={cn.createForm}>
      <div className={cn.fields}>
        <InputC
          placeholder="Максимум игроков"
          val={numPlayers}
          setVal={setNumPlayers}
        />

        <BtnTextIco
          cb={openSettings}
          text="Настройки игры"
          icon={imgS}
          alt="settings"
          disabled={!isLeader}
        />
      </div>

      <div className={cn.buttons}>
        <BtnText text="Назад" type="secondary" cb={back}/>
        <BtnText text="Создать" cb={connect}/>
      </div>
    </div>
  );
};

export default CreateForm;