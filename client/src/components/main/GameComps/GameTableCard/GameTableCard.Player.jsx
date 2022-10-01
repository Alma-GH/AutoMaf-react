import React, {useContext} from 'react';
import {
  AVATAR_DEAD,
  AVATAR_JUDGED,
  AVATAR_NORMAL,
  AVATAR_SPEAK,
  CARD_MAFIA,
  PHASE_NIGHT_MAFIA
} from "../../../../tools/const"
import cls from "./GameTableCard.module.scss"
import {RoomContext} from "../../../../context/contexts";
import Socket from "../../../../tools/Services/Socket";
import MessageCreator from "../../../../tools/Services/MessageCreator";
import Avatar from "./Avatar";
import GameService from "../../../../tools/Services/GameService";

const GameTableCardPlayer = ({player}) => {

  const context = useContext(RoomContext)
  const me = context.player
  const room = context.room

  const game = GameService.getGame(room)
  const rID = GameService.getRoomID(room)
  const myID = GameService.getID(me)
  const pID = GameService.getID(player)
  const phase = GameService.getPhase(game)
  const end = GameService.getEnd(game)


  const votes       = GameService.numVotes(player,game)
  const nightVotes  = GameService.numNightVotes(player,game)
  const avatar      = getAvatar(player)
  const name        = GameService.getName(player)
  const playerRole  = GameService.getRole(player,game)

  function vote(){
    const message = MessageCreator.vote(rID, myID, pID)

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
  return (
    <div className={style.join(" ")} onClick={getFunction(phase)}>
      {(votes>0 || (nightVotes>0 && (GameService.getRole(me,game) === CARD_MAFIA))) &&
        <div className={cls.counter}>{votes || nightVotes}</div>
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