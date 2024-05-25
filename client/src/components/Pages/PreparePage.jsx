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
import BtnIco from "../UI/BtnIco/BtnIco";
import imgCross from "../../assets/imgs/cross.svg"
import ModalQuit from "../UI/Modal/ModalQuit";
import useBoolean from "../../hooks/useBoolean";

const PreparePage = () => {

  const [openSettings, setOpenSettings] = useState(false)

  const context = useContext(RoomContext)
  const room    = context.room

  const [isModalQuitOpen, openModal, closeModal] = useBoolean(false);

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

      <BtnIco
        cb={openModal}
        type="secondary"
        img={imgCross}
        alt="cross"
        addCls="closeButton"
      />

      <MainCard addCls="formBlock">
        <h2>Подготовка</h2>
        <PrepareBlock setOpenSettings={setOpenSettings} />
      </MainCard>

      <ModalQuit isOpen={isModalQuitOpen} onClose={closeModal}/>
    </div>
  );
};

export default PreparePage;