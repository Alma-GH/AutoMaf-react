import React, {useContext} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import clsWin from "../main/WindowInput/WindowInput.module.scss"
import BtnText from "../UI/BtnText/BtnText";
import {MessageContext, RoomContext} from "../../context/contexts";
import Socket from "../../tools/Services/Socket";
import {LINK_GAME} from "../../tools/const";
import MessageCreator from "../../tools/Services/MessageCreator";
import GameService from "../../tools/Services/GameService";
import ModalQuit from "../UI/Modal/ModalQuit";
import PrepareCount from "../main/PrepareComps/PrepareCount";
import PreparePlayerList from "../main/PrepareComps/PreparePlayerList";
import {useModal} from "../../hooks/useModal";
import {useRedirect} from "../../hooks/useRedirect";
import {useTimerStage} from "../../hooks/useTimerStage";
import {errorByTimer} from "../../tools/func";


const PreparePage = () => {

  const [modal,openModal, closeModal] = useModal()

  const context = useContext(RoomContext)

  const player  = context.player
  const room    = context.room

  const players = GameService.getMembers(room)
  const max     = GameService.getMaxMembers(room)


  function startGame(){
    const id      = GameService.getRoomID(room)
    const message = MessageCreator.startGame(id)

    Socket.send(JSON.stringify(message))
  }

  useRedirect(
    GameService.getRoomStatus(room),
    room,
    LINK_GAME
  )

  return (
    <div className="prepPage">

      <h1>Подготовка</h1>

      <WindowInput>
        <div className={clsWin.inputCont}>
          <PrepareCount max={max} num={players.length} stage={0}/>
          <PreparePlayerList players={players} me={player}/>
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