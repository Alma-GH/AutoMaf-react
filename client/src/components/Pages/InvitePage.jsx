import React from 'react';
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import ProfileForm from "../main/ProfileForm/ProfileForm";
import {useSearchParams} from "react-router-dom";

const InvitePage = () => {
  const [searchParams] = useSearchParams()

  const enterRoom = () => {
    console.log("ENTER ROOM " + searchParams.get("room"))
  }

  return (
    <div className="prepPage">
      <Header />

      <MainCard addCls="formBlock">
        <h2>Приглашение</h2>
        <ProfileForm continueCB={enterRoom} />
      </MainCard>
    </div>
  );
};

export default InvitePage;