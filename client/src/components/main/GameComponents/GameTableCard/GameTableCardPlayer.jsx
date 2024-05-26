import React, {useContext} from 'react';
import {
  AVATAR_DEAD,
  AVATAR_NORMAL,
  AVATAR_SPEAK,
  CARD_CIVIL,
  CARD_DETECTIVE, CARD_DOCTOR,
  CARD_MAFIA,
  T_VOTE
} from "../../../../tools/const"
import cn from "./GameTableCard.module.scss"
import {RoomContext, ServerTimerContext} from "../../../../context/contexts";
import Socket from "../../../../tools/Services/Socket";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import GameService from "../../../../tools/Services/GameService";
import CardType from "./CardType";
import clsx from "clsx";

const GameTableCardPlayer = ({player}) => {

  const context = useContext(RoomContext)
  const tContext = useContext(ServerTimerContext)
  const me = context.player
  const room = context.room
  const time = tContext?.timer?.time
  const timer = tContext?.timer?.name

  const game = GameService.getGame(room)
  const rID = GameService.getRoomID(room)
  const myID = GameService.getID(me)
  const pID = GameService.getID(player)
  const phase = GameService.getPhase(game)
  const end = GameService.getEnd(game)

  const numVotes    = GameService.numVotes(player,game)
  const nightVotes  = GameService.numNightVotes(player,game)
  const avatar      = getAvatar(player)
  const name        = GameService.getName(player)
  const playerRole  = GameService.getRole(player,game)
  const playerAvatar = GameService.getAvatar(player)

  const myVote = GameService.getPlayerVote(GameService.getPlayerByID(myID,game),game)

  function vote(){

    const nullMessage = MessageCreator.vote(rID, myID, null)
    const message = MessageCreator.vote(rID, myID, pID)


    if(myVote === pID){
      Socket.send(JSON.stringify(nullMessage))
      return
    }

    if(myVote !== null)
      Socket.send(JSON.stringify(nullMessage))
    Socket.send(JSON.stringify(message))

  }
  function voteNight(){
    const message = MessageCreator.voteNight(rID, myID, pID)

    Socket.send(JSON.stringify(message))
  }

  function getFunction(phase){
    if(!phase)
      return vote

    return GameService.isNight(game) ? voteNight : vote
  }

  function getAvatar(player){

    if(!player)
      return AVATAR_NORMAL

    if(!player.alive)
      return AVATAR_DEAD

    if(player.speak)
      return AVATAR_SPEAK

    return AVATAR_NORMAL
  }

  function teamStyle(){

    const cardMatch = GameService.isPlayerToMatchNightPhase(player,game)
    const myMatch = GameService.isPlayerToMatchNightPhase(me, game)
    const amIAlive = GameService.getPlayersAlive(game)?.some(pl=>(
      GameService.getID(pl) === GameService.getID(me)
    ))

    return cardMatch && (myMatch || !amIAlive)
  }

  function detectStyle(){

    const myRole = GameService.getRole(me, game)
    const player = GameService.getPlayerByID(pID, game)

    return myRole === CARD_DETECTIVE && player.detected;
  }

  const isDetected = detectStyle()
  const isTeamStyle = teamStyle()
  const isPlayerReady = GameService
    .getPlayersReady(game)
    ?.some(readyPlayer => GameService.getID(readyPlayer) === GameService.getID(player))
  const isCounterVotesVisible = (numVotes>0 || (nightVotes>0 && (GameService.isPlayerToMatchNightPhase(me,game))))
  const isTimeToKick = (timer === T_VOTE && GameService.getChoice(game) === pID && time !== 0)
  console.log("ROOLE")
  return (
    <div
      className={clsx(
        cn.container,
        cn.cardPlayer,
        myID === pID && cn.you,
        isTeamStyle && cn.team,
        myVote === pID && cn.vote
      )}
      onClick={getFunction(phase)}
    >


      {end && <img
        className={clsx(
          cn.imgRole,
          playerRole === CARD_MAFIA && cn.maf,
          playerRole === CARD_CIVIL && cn.civ,
          playerRole === CARD_DOCTOR && cn.doc,
          playerRole === CARD_DETECTIVE && cn.det,
        )}
        src={GameService.getImgByRole(playerRole)} alt={playerRole}
      />}
      {isCounterVotesVisible &&
        <div className={clsx(cn.counterVotes, isTimeToKick && cn.shadow)}>
          {numVotes || nightVotes}
        </div>
      }
      {isTimeToKick && <div className={cn.timer}>{time}</div>}

      <CardType state={avatar} avatarIndex={playerAvatar} />

      <div
        title={name}
        className={clsx(
          cn.name,
          end && cn.end,
          isTimeToKick && cn.shadow,
          isDetected && playerRole === CARD_MAFIA && cn.detectMaf,
          isDetected && playerRole !== CARD_MAFIA && cn.detectCiv
        )}
      >
        {name}
      </div>


      {isPlayerReady && <div className={cn.ready} />}
    </div>
  );
};

export default GameTableCardPlayer;