import React, {useContext} from "react";
import {RoomContext, ServerTimerContext} from "../../../../context/contexts";
import GameService from "../../../../tools/Services/GameService";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import Socket from "../../../../tools/Services/Socket";
import BtnTextIco from "../../../UI/BtnTextIco/BtnTextIco";
import imgS from "../../../../assets/imgs/spanner.png";
import BtnText from "../../../UI/BtnText/BtnText";
import cn from "./PrepareBlock.module.scss"
import PrepareCountPlayers from "../PrepareCountPlayers/PrepareCountPlayers";
import PreparePlayerList from "../PreparePlayerList/PreparePlayerList";
import {LINK_INVITE, M_CLIPBOARD, T_CLIPBOARD} from "../../../../tools/const";
import {toast} from "react-toastify";

const PrepareBlock = ({setOpenSettings}) => {



  const context = useContext(RoomContext)
  const tContext = useContext(ServerTimerContext)

  const player  = context.player
  const room    = context.room

  const players = GameService.getMembers(room)
  const max     = GameService.getMaxMembers(room)
  const isLeader = GameService.isLeader(player, players)

  const time = tContext.timer?.time

  function startGame(){
    const id      = GameService.getRoomID(room)
    const message = MessageCreator.startGame(id)

    Socket.send(JSON.stringify(message))
  }

  function getStage(){
    return time ? 6 - time : 0
  }

  const openSettings = () => {
    setOpenSettings(true)
    console.log("click")
  }

  const handlerInviteClick = () => {
    navigator.clipboard.writeText(window.location.origin + LINK_INVITE + "?room=" + GameService.getRoomID(room))
      .then(() => toast(M_CLIPBOARD, {toastId: T_CLIPBOARD}))
  }

  return (
    <div className={cn.block}>
      <div className={cn.body}>
        <PrepareCountPlayers max={max} num={players.length} stage={getStage()}/>
        <BtnTextIco
          cb={openSettings}
          text="Настройки игры"
          icon={imgS}
          alt="settings"
          disabled={!isLeader}
        />
        <PreparePlayerList players={players} me={player}/>
      </div>

      <div className={cn.buttons}>
        <BtnText addCls={cn.button} text="Пригласить"  cb={handlerInviteClick} />
        <BtnText addCls={cn.button} text="Начать" cb={startGame} disabled={!GameService.isLeader(player,players)}/>
      </div>
    </div>
  )
}

export default PrepareBlock;