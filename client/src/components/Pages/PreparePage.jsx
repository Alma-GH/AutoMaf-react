import React, {useContext, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import BtnText from "../UI/BtnText/BtnText";
import {MessageContext, RoomContext, ServerTimerContext} from "../../context/contexts";
import Socket from "../../tools/Services/Socket";
import {LINK_GAME, LINK_START} from "../../tools/const";
import MessageCreator from "../../tools/Services/MessageCreator";
import GameService from "../../tools/Services/GameService";
import ModalQuit from "../UI/Modal/ModalQuit";
import PrepareCount from "../main/PrepareComps/PrepareCount";
import PreparePlayerList from "../main/PrepareComps/PreparePlayerList";
import {useModal} from "../../hooks/useModal";
import {useRedirect} from "../../hooks/useRedirect";
import {errorByTimer} from "../../tools/func";
import CreateBtnSettings from "../main/CreateComps/CreateBtnSettings";
import CreateSettings from "../main/CreateComps/CreateSettings";


const PreparePage = () => {

  const [modal,openModal, closeModal] = useModal()

  const [openSettings, setOpenSettings] = useState(false)

  const context = useContext(RoomContext)
  const tContext = useContext(ServerTimerContext)
  const mContext = useContext(MessageContext)

  const player  = context.player
  const room    = context.room

  const players = GameService.getMembers(room)
  const max     = GameService.getMaxMembers(room)

  const time = tContext.timer?.time


  function startGame(){
    const id      = GameService.getRoomID(room)
    const message = MessageCreator.startGame(id)

    Socket.send(JSON.stringify(message))
  }

  function getStage(){
    return time ? 6 - time : 0
  }

  useRedirect(
    GameService.getRoomStatus(room),
    room,
    LINK_GAME
  )

  useRedirect(
    Socket.websocket===null,
    mContext.error,
    LINK_START,
    ()=>{
      const mess = "Упс. Сокет закрылся(мб. проблема на сервере)"
      errorByTimer(mContext.setError, mess, "out socket", 3000)
    }
  )

  if(openSettings)
    return <CreateSettings setOpenSettings={setOpenSettings}/>

  return (
    <div className="prepPage">

      <h1>Подготовка</h1>

      <WindowInput>
        <div className={clsWin.inputCont}>
          <PrepareCount max={max} num={players.length} stage={getStage()}/>
          <PreparePlayerList players={players} me={player}/>
          <CreateBtnSettings setOpenSettings={setOpenSettings}/>
        </div>

        <div className={clsWin.btnCont}>
          <BtnText text="Выйти" color="red" cb={openModal}/>
          <BtnText text="Начать" cb={startGame} disabled={!GameService.isLeader(player,players)}/>
        </div>



      </WindowInput>


      <ModalQuit isOpen={modal} onClose={closeModal}/>
    </div>
  );
};

export default PreparePage;