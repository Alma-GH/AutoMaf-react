import React, {useContext, useEffect, useState} from 'react';
import Header from "../main/Header/Header";
import MainCard from "../main/MainCard/MainCard";
import CreateForm from "../main/CreateForm/CreateForm";
import SettingsForm from "../main/SettingsForm/SettingsForm";
import {DEF_SETTINGS} from "../../tools/const";
import {SettingsContext} from "../../context/contexts";


const CreatePage = () => {

  const sContext = useContext(SettingsContext)
  const setNewSettings = sContext.setSettings

  const [openSettings, setOpenSettings] = useState(false)

  useEffect(()=>{
    return () => setNewSettings(DEF_SETTINGS)
  }, [setNewSettings])


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
        <h2>Создать комнату</h2>
        <CreateForm setOpenSettings={setOpenSettings} />
      </MainCard>
    </div>
  );
};

export default CreatePage;