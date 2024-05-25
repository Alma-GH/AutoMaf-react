import React, {useContext} from 'react';
import Modal from "react-modal";
import BtnText from "../BtnText/BtnText";
import GameService from "../../../tools/Services/GameService";
import MessageCreator from "../../../tools/Services/MessageCreator";
import Socket from "../../../tools/Services/Socket";
import {LINK_START} from "../../../tools/const";
import {RoomContext} from "../../../context/contexts";
import {useNavigate} from "react-router-dom";
import cls from "./Modal.module.scss"

Modal.setAppElement('#root');

const ModalQuit = ({isOpen, onClose}) => {
  const nav = useNavigate()

  const context = useContext(RoomContext)
  const room = context.room
  const player = context.player

  function quit(){
    const rID     = GameService.getRoomID(room)
    const pID     = GameService.getID(player)
    const message = MessageCreator.quit(rID, pID)

    if(Socket.getState(true))
      Socket.send(JSON.stringify(message))
    context.setRoom(null)
    context.setPlayer(null)
    nav(LINK_START)
    Socket.close()
    // localStorage.removeItem(S_PLAYER_ID)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={cls.content}
      overlayClassName={cls.overlay}
    >
      <p className={cls.question}>Вы уверены, что хотите выйти?</p>
      <div className={cls.btns}>
        <BtnText text="Выйти" type="secondary" cb={quit}/>
        <BtnText text="Остаться" cb={onClose}/>
      </div>
    </Modal>
  );
};

export default ModalQuit;