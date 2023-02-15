import React, {useContext, useEffect, useState} from 'react';
import WindowInput from "../WindowInput/WindowInput";
import clsWin from "../WindowInput/WindowInput.module.scss";
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

const select1 = { value: S_VOTE_TYPE_REALTIME, label: 'Realtime' }
const select2 = { value: S_VOTE_TYPE_CLASSIC, label: 'Классическое' }
const select3 = { value: S_VOTE_TYPE_FAIR, label: 'Честное' }

const CreateSettings = ({setOpenSettings}) => {

  const rContext = useContext(RoomContext)
  const sContext = useContext(SettingsContext)

  const room = rContext?.room
  const roomSettings = room?.gameOptions
  const settings = sContext.settings
  const setNewSettings = sContext.setSettings

  const options = [
    select1,
    select2,
    // select3,
  ]

  function setVoteType(select){
    setNewSettings({...settings, voteType: select.value})
  }
  function setAutoRole(choices){
    const val = choices[0].value
    setNewSettings({...settings, autoRole: val})
  }
  function typeMaf(val){
    setNewSettings({...settings, numMaf: val})
  }
  function typeDet(val){
    setNewSettings({...settings, numDet: val})
  }
  function typeDoc(val){
    setNewSettings({...settings, numDoc: val})
  }

  function saveSettings(){
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

  return (
    <div className="prepPage">
      <h1>Настройки</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <Select
            options={options}
            value={options.find(opt=>opt.value === settings.voteType)}
            onChange={setVoteType}
            placeholder={"Вид голосования"}
            classNames={{
              control: () => clsWin.inSettingsSelect,
              option: () => clsWin.inSettingsOption,
              menu: () => clsWin.inSettingsMenu
            }}
          />
          <CheckboxAdd
            choices={[{name:"Авто баланс", value: settings.autoRole}]}
            setChoices={setAutoRole}
            op={!settings.autoRole}
            contClass={clsWin.inputsNumbersRoles}
          >
            <InputC placeholder="К-во членов мафии" type={"number"} val={settings.numMaf} setVal={typeMaf}/>
            <InputC placeholder="К-во детективов" type={"number"} val={settings.numDet} setVal={typeDet}/>
            <InputC placeholder="К-во докторов" type={"number"} val={settings.numDoc} setVal={typeDoc}/>
          </CheckboxAdd>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red" cb={()=>setOpenSettings(false)}/>
          {room &&
            <BtnText text="Сохранить" color="green"
                     cb={()=>saveSettings()}
                     disabled={nonTypeComparisonFlatObjects(roomSettings, settings)}
            />
          }


        </div>

      </WindowInput>
    </div>
  );
};

export default CreateSettings;