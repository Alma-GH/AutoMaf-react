import React, {useContext} from 'react';
import {
  AVATAR_DEAD,
  AVATAR_JUDGED,
  AVATAR_NORMAL,
  AVATAR_SPEAK, AVATAR_TIMER,
  CARD_MAFIA,
  PHASE_NIGHT_MAFIA, T_VOTE
} from "../../../../tools/const"
import cls from "./GameTableCard.module.scss"
import {RoomContext, ServerTimerContext} from "../../../../context/contexts";
import Socket from "../../../../tools/Services/Socket";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import Avatar from "./Avatar";
import GameService from "../../../../tools/Services/GameService";

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
  function voteKill(){
    const message = MessageCreator.voteNight(rID, myID, pID)

    Socket.send(JSON.stringify(message))
  }

  function getFunction(phase){
    if(!phase)
      return vote

    const map = {
      [PHASE_NIGHT_MAFIA]: voteKill,
    }
    const func = map[phase]
    return func ? func : vote
  }

  function getAvatar(player){

    if(!player)
      return AVATAR_NORMAL

    if(!player.alive)
      return AVATAR_DEAD

    if(player.speak)
      return AVATAR_SPEAK

    if(player.judged)
      return AVATAR_JUDGED

    if(timer === T_VOTE && GameService.getChoice(game) === pID && time !== 0)
      return AVATAR_TIMER

    return AVATAR_NORMAL
  }

  function teamStyle(){

    const cardMatch = GameService.isPlayerToMatchNightPhase(player,game)
    const myMatch = GameService.isPlayerToMatchNightPhase(me, game)
    const amIAlive = GameService.getPlayersAlive(game)?.some(pl=>(
      GameService.getID(pl) === GameService.getID(me)
    ))

    const notMyCard   = pID!==myID

    return cardMatch && notMyCard && (myMatch || !amIAlive)
  }


  const style = []
  style.push(cls.parent)
  if(myID===pID)  style.push(cls.you)
  if(teamStyle()) style.push(cls.team)
  if(myVote===pID) style.push(cls.vote)
  return (
    <div className={style.join(" ")} onClick={getFunction(phase)}>
      {(numVotes>0 || (nightVotes>0 && (GameService.getRole(me,game) === CARD_MAFIA))) &&
        <div className={cls.counter}>{numVotes || nightVotes}</div>
      }

      {!end
        ? <Avatar state={avatar}/>
        : <img src={GameService.getImgByRole(playerRole)} alt={playerRole}/>
      }

      <div className={cls.name}>{name}</div>
    </div>
  );
};

export default GameTableCardPlayer;