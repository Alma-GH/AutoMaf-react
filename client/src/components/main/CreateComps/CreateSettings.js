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

const select1 = { value: S_VOTE_TYPE_REALTIME, label: 'Realtime' }
const select2 = { value: S_VOTE_TYPE_CLASSIC, label: 'Классическое' }
const select3 = { value: S_VOTE_TYPE_FAIR, label: 'Честное' }

const CreateSettings = ({setOpenSettings}) => {

  const rContext = useContext(RoomContext)
  const sContext = useContext(SettingsContext)

  const room = rContext?.room
  const settings = room?.gameOptions || sContext.settings
  const setNewSettings = sContext.setSettings

  const options = [
    select1,
    select2,
    select3,
  ]

  const [valSelect, setValSelect] = useState(settings
      ? options.find(opt=>opt.value === settings.voteType)
      : select1
  )


  function setVoteType(select){

    if(room){
      const message = MessageCreator.setSettings(GameService.getRoomID(room),select.value)
      Socket.send(JSON.stringify(message))
    }

    setValSelect(select)
  }

  useEffect(()=>{

    if(!room)
      setNewSettings({
        voteType: valSelect.value
      })

  }, [room, valSelect])

  return (
    <div className="prepPage">
      <h1>Настройки</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          <Select
            options={options}
            value={valSelect}
            onChange={setVoteType}
            placeholder={"Вид голосования"}
            classNames={{
              control: () => clsWin.inSettingsSelect,
              option: () => clsWin.inSettingsOption,
              menu: () => clsWin.inSettingsMenu
            }}
          />
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Назад" color="red" cb={()=>setOpenSettings(false)}/>
        </div>

      </WindowInput>
    </div>
  );
};

export default CreateSettings;