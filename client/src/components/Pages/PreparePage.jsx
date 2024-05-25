import React, {useContext, useState} from 'react';
import {RoomContext} from "../../context/contexts";
import {LINK_GAME} from "../../tools/const";
import GameService from "../../tools/Services/GameService";
import {useRedirect} from "../../hooks/useRedirect";
import useRedirectCloseConnection from "../../hooks/useRedirectCloseConnection";
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import SettingsForm from "../main/SettingsForm/SettingsForm";
import PrepareBlock from "../main/PrepareComponents/PrepareBlock/PrepareBlock";


const PreparePage = () => {

  const [openSettings, setOpenSettings] = useState(false)

  const context = useContext(RoomContext)
  const room    = context.room


  useRedirect(
    GameService.getRoomStatus(room),
    room,
    LINK_GAME
  )

  useRedirectCloseConnection()

  if(openSettings)
    return (
      <div className="prepPage">
        <Header />

        <MainCard addCls="formBlock">
          <h2>Настройки</h2>
          <SettingsForm setOpenSettings={setOpenSettings} />
        </MainCard>
      </div>
    )

  return (

    <div className="prepPage">
      <Header />

      <MainCard addCls="formBlock">
        <h2>Подготовка</h2>
        <PrepareBlock setOpenSettings={setOpenSettings} />
      </MainCard>
    </div>
  );
};

export default PreparePage;