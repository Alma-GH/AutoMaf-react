import React, {useContext} from 'react';
import GameTable from "../main/GameComps/GameTable/GameTable";
import BtnText from "../UI/BtnText/BtnText";
import CardViewer from "../main/GameComps/GameCardViewer/CardViewer";
import GameLog from "../main/GameComps/GameLog/GameLog";
import {LINK_PREPARE, LINK_START, PHASE_DAY_DISCUSSION, PHASE_PREPARE, T_START} from "../../tools/const"
import {MessageContext, RoomContext, ServerTimerContext} from "../../context/contexts";
import Socket from "../../tools/Services/Socket";
import MessageCreator from "../../tools/Services/MessageCreator";
import {errorByTimer} from "../../tools/func";
import GameService from "../../tools/Services/GameService";
import ModalQuit from "../UI/Modal/ModalQuit";
import {useModal} from "../../hooks/useModal";
import {useRedirect} from "../../hooks/useRedirect";
import clsLoad from "./../../components/Notification/Loader.module.scss"
import clsReadyBtn from "./../../components/UI/BtnText/BtnText.module.scss"

const GamePage = () => {

  const [modal,openModal, closeModal] = useModal()

  //server data
  const context = useContext(RoomContext)
  const mContext = useContext(MessageContext)
  const tContext = useContext(ServerTimerContext)

  const room = context.room
  const player = context.player
  const timer = tContext?.timer

  const rID     = GameService.getRoomID(room)
  const myID    = GameService.getID(player)

  //TODO: union in method .getAllGame()
  const members = GameService.getMembers(room)
  const game    = GameService.getGame(room)
  const cards   = GameService.getCards(game)
  const players = GameService.getPlayers(game)
  const end     = GameService.getEnd(game)
  const phase   = GameService.getPhase(game)


  //vars
  const disabledBtnReady =
    !GameService.isPlayer(player,game) ||
    GameService.getPlayerByID(myID,game).readiness ||
    !GameService.getPlayerByID(myID,game).alive ||
    ![PHASE_DAY_DISCUSSION,PHASE_PREPARE].includes(phase) ||
    end

  const sleep =
    (GameService.isNight(game) &&
    GameService.getPlayerByID(myID,game).alive &&
    !GameService.isPlayerToMatchNightPhase(player,game)) ||
    (timer
        ? timer.name === T_START && timer.time !== 0
        : false
    )


  function readiness(){
    const message = MessageCreator.readiness(rID, myID)

    Socket.send(JSON.stringify(message))
  }

  function restart(){
    const message = MessageCreator.startGame(rID)

    Socket.send(JSON.stringify(message))
  }

  function returnInLobby(){
    const message = MessageCreator.stopGame(rID)

    Socket.send(JSON.stringify(message))
  }

  useRedirect(
    !GameService.getRoomStatus(room),
    room,
    LINK_PREPARE,
  )

  useRedirect(
    Socket.websocket===null,
    mContext.error,
    LINK_START,
    ()=>{
      const mess = "Упс. Сокет закрылся"
      errorByTimer(mContext.setError, mess, "out socket", 3000)
      context.setRoom(null)
      context.setPlayer(null)
    }
  )

  return (
    <div className="gamePage">

      <div className="right">
        <GameTable
          cards={cards ?? []}
          players={players ?? []}
          phase={phase}
        />

        <div className="btnCont">
          <BtnText text="Выйти" color="red" cb={openModal}/>
          {end && GameService.isLeader(player, members)
            ? <>
              <BtnText text="Lobby" color="yellow" cb={returnInLobby}/>
              <BtnText text="Restart" color="yellow" cb={restart}/>
            </>
            : <BtnText
                text="Готов"
                disabled={disabledBtnReady}
                cb={readiness}
                addCls={!disabledBtnReady ? clsReadyBtn.attention : null}
              />
          }
        </div>

        <CardViewer enabled={true} role={GameService.getRole(player,game)}/>
      </div>


      <GameLog/>


      <ModalQuit isOpen={modal} onClose={closeModal}/>

      {sleep && <div className="gameBack"/>}

      {end &&
        <StartLoader stage={tContext.timer.time}/>
      }
    </div>
  );
};

export default GamePage;



const StartLoader = ({stage})=>{

  if(stage===0)
    return
  return (
    <div className={clsLoad.startFromGame}>
        {stage}
    </div>
  );
}