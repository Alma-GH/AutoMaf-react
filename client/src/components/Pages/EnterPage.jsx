import React from 'react';
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import ProfileForm from "../main/ProfileForm/ProfileForm";
import {useNavigate} from "react-router-dom";
import {LINK_START} from "../../tools/const";

const EnterPage = () => {
  const nav = useNavigate()
  const toStart = () => nav(LINK_START)

  return (
    <div className="enterPage">
      <Header />

      <MainCard addCls="inputCont">
        <ProfileForm continueCB={toStart} />
      </MainCard>
    </div>
  );
};

export default EnterPage;