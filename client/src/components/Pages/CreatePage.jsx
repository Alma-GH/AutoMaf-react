import React, {useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss";
import InputC from "../UI/InputC/InputC";
import BtnText from "../UI/BtnText/BtnText";
import imgS from "./../../assets/imgs/spanner.png"
import CheckboxC from "../UI/CheckboxC/CheckboxC";

const CreatePage = () => {

  const [openSettings, setOpenSettings] = useState(false)

  const [addPass, setAddPass] = useState([
    {name:"Добавить пароль", value: false}
  ])

  const [room, setRoom] = useState("")
  const [pass, setPass] = useState("")
  const [numPlayers, setNumPlayers] = useState("")

  const op = addPass[0].value



  return (
    <div className="prepPage">
      <h1>Создать комнату</h1>

      <WindowInput>

        <div className={clsWin.inputCont}>
          {!openSettings
            ?
              <>
                <InputC
                  placeholder="Название комнаты"
                  val={room}
                  setVal={setRoom}
                />

                {/*union in component*/}
                <CheckboxC choices={addPass} setChoices={setAddPass}/>
                <div style={{ visibility: (op ? "visible" : "hidden") }}>
                  <InputC
                    placeholder="Пароль"
                    val={pass}
                    setVal={setPass}
                  />
                </div>

                <InputC
                  placeholder="Игроков"
                  val={numPlayers}
                  setVal={setNumPlayers}
                />

                <button onClick={()=>setOpenSettings(true)} className={clsWin.settingsBtn}>
                  Настройки игры
                  <div className={clsWin.imgCont}>
                    <img src={imgS} alt="Settings"/>
                  </div>
                </button>
              </>
            :
              <>
                SETTINGS
              </>
          }
        </div>

        <div className={clsWin.btnCont}>
          {!openSettings
            ?
              <>
                <BtnText text="Назад" color="red"/>
                <BtnText text="Создать"/>
              </>
            :
              <>
                <BtnText text="Назад" color="red" cb={()=>setOpenSettings(false)}/>
              </>
          }
        </div>

      </WindowInput>
    </div>
  );
};

export default CreatePage;