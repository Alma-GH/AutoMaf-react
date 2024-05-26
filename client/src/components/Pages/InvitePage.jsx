import React, {useContext, useState} from 'react';
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import ProfileForm from "../main/ProfileForm/ProfileForm";
import {useNavigate, useSearchParams} from "react-router-dom";
import ModalQuit from "../UI/Modal/ModalQuit";
import useBoolean from "../../hooks/useBoolean";
import BtnIco from "../UI/BtnIco/BtnIco";
import imgCross from "../../assets/imgs/cross.svg";
import {AvatarContext, MessageContext} from "../../context/contexts";
import {useConnection} from "../../hooks/useConnection";
import {DEFAULT_NAME, S_NICK} from "../../tools/const";
import MessageCreator from "../../tools/Services/MessageCreator";
import Socket from "../../tools/Services/Socket";
import Loader from "../Notification/Loader";

const InvitePage = () => {
  const [searchParams] = useSearchParams()

  const [isModalQuitOpen, openModal, closeModal] = useBoolean(false);


  const avatarContext = useContext(AvatarContext)
  const mContext = useContext(MessageContext)
  const isLoad = mContext.loading
  const avatar = avatarContext.avatar

  const connect = useConnection(findRoom)

  function findRoom(){
    const name = localStorage.getItem(S_NICK) || DEFAULT_NAME
    const message = MessageCreator.findRoom(name, avatar, searchParams.get("room"))

    Socket.send(JSON.stringify(message));
  }


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
        <h2>Приглашение</h2>
        {!isLoad ? <ProfileForm continueCB={connect} /> : <Loader />}
      </MainCard>

      <ModalQuit isOpen={isModalQuitOpen} onClose={closeModal}/>
    </div>
  );
};

export default InvitePage;