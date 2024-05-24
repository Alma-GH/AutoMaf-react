import React, {useContext, useEffect, useState} from 'react';
import BtnText from "../../UI/BtnText/BtnText";
import {RoomContext, SettingsContext} from "../../../context/contexts";
import Select from 'react-select'
import {S_VOTE_TYPE_CLASSIC, S_VOTE_TYPE_FAIR, S_VOTE_TYPE_REALTIME} from "../../../tools/const";
import MessageCreator from "../../../tools/Services/MessageCreator";
import GameService from "../../../tools/Services/GameService";
import Socket from "../../../tools/Services/Socket";
import CheckboxC from "../../UI/CheckboxC/CheckboxC";
import CheckboxAdd from "../../UI/CheckboxAdd/CheckboxAdd";
import InputC from "../../UI/InputC/InputC";
import {nonTypeComparisonFlatObjects} from "../../../tools/func";
import Header from "../Header/Header";
import MainCard from "../MainCard/MainCard";
import SettingsForm from "../SettingsForm/SettingsForm";

const CreateSettings = ({setOpenSettings}) => {


  return (
    <div className="prepPage">
      <Header />

      <MainCard>
        <h1>Настройки</h1>
        <SettingsForm setOpenSettings={setOpenSettings} />
      </MainCard>
    </div>
  );
};

export default CreateSettings;