import React from 'react';
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import ProfileForm from "../main/ProfileForm/ProfileForm";
import {useSearchParams} from "react-router-dom";
import ModalQuit from "../UI/Modal/ModalQuit";
import useBoolean from "../../hooks/useBoolean";
import BtnIco from "../UI/BtnIco/BtnIco";
import imgCross from "../../assets/imgs/cross.svg";

const InvitePage = () => {
  const [searchParams] = useSearchParams()

  const [isModalQuitOpen, openModal, closeModal] = useBoolean(false);

  const enterRoom = () => {
    console.log("ENTER ROOM " + searchParams.get("room"))
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
        <ProfileForm continueCB={enterRoom} />
      </MainCard>

      <ModalQuit isOpen={isModalQuitOpen} onClose={closeModal}/>
    </div>
  );
};

export default InvitePage;