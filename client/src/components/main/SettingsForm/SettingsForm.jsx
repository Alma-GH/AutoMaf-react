import React, {useContext} from 'react';
import CheckboxAdd from "../../UI/CheckboxAdd/CheckboxAdd";
import InputC from "../../UI/InputC/InputC";
import BtnText from "../../UI/BtnText/BtnText";
import {nonTypeComparisonFlatObjects} from "../../../tools/func";
import {RoomContext, SettingsContext} from "../../../context/contexts";
import MessageCreator from "../../../tools/Services/MessageCreator";
import GameService from "../../../tools/Services/GameService";
import Socket from "../../../tools/Services/Socket";
import cn from "./SettingsForm.module.scss"

const useSettings = () => {
  const sContext = useContext(SettingsContext)
  const settings = sContext.settings
  const setSettings = sContext.setSettings

  const setAutoBalance = (value) => setSettings(prev => ({ ...prev, autoRole: value }))
  const setMaf = (value) => setSettings(prev => ({ ...prev, numMaf: value }))
  const setDet = (value) => setSettings(prev => ({ ...prev, numDet: value }))
  const setDoc = (value) => setSettings(prev => ({ ...prev, numDoc: value }))

  return {
    settings,
    setAutoBalance,
    setMaf,
    setDet,
    setDoc
  }
}

const BtnSaveSettings = ({ settings }) => {

  const rContext = useContext(RoomContext)


  const room = rContext?.room
  const roomSettings = room?.gameOptions

  const saveSettings = () => {
    if(room){
      const message = MessageCreator.setSettings(
        GameService.getRoomID(room),
        settings.voteType,
        settings.autoRole,
        +settings.numMaf,
        +settings.numDet,
        +settings.numDoc
      )
      Socket.send(JSON.stringify(message))
    }
  }

  if(!room){
    return null
  }

  return (
    <BtnText
      text="Сохранить"
      cb={()=>saveSettings()}
      disabled={nonTypeComparisonFlatObjects(roomSettings, settings)}
    />
  )
}

const SettingsForm = ({setOpenSettings}) => {
  const {
    settings,
    setAutoBalance,
    setMaf,
    setDet,
    setDoc
  } = useSettings();

  const {
    autoRole,
    numMaf,
    numDet,
    numDoc
  } = settings

  return (
    <div className={cn.settingsForm}>
      <div className={cn.fields}>
        <CheckboxAdd
          choice={{name:"Авто баланс", value: settings.autoRole}}
          setChoice={(choice) => setAutoBalance(choice.value)}
          op={!autoRole}
          contClass={cn.fields}
        >
          <InputC placeholder="К-во членов мафии" type={"number"} val={numMaf} setVal={setMaf}/>
          <InputC placeholder="К-во детективов" type={"number"} val={numDet} setVal={setDet}/>
          <InputC placeholder="К-во докторов" type={"number"} val={numDoc} setVal={setDoc}/>
        </CheckboxAdd>
      </div>

      <div className={cn.buttons}>
        <BtnText text="Назад" color="red" cb={()=>setOpenSettings(false)}/>
        <BtnSaveSettings settings={settings} />
      </div>
    </div>
  );
};

export default SettingsForm;