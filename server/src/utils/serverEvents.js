
import Player from "../class/Player.js";
import Room from "../class/Room.js";
import Server from "../class/Server.js";
import ChatLog from "../class/ChatLog.js";

import {EM_GAME_PROCESS, EM_VOTE_ON_TIMER, EM_WRONG_PASS} from "./const.js";

function create_room(data){
  const dataCR = data

  const leader = new Player(dataCR.nameCreator)
  const newRoom = new Room(
    leader,
    dataCR.numPlayers,
    dataCR.nameRoom,
    dataCR.existPassword ? dataCR.password : null
  )
  Server.addRoom(newRoom)


  return [newRoom,leader]
}

function find_room(data){
  const dataFR = data

  const finder        = new Player(dataFR.nameFinder)
  const needRoom      = Server.getRoomByName(dataFR.nameRoom)
  //TODO: Room.tryConnect()
  const rightPass = needRoom.getPass() ? needRoom.getPass() === dataFR.passRoom : true
  const inGame = needRoom.getStatus() || needRoom.hasAnyTimer()

  if(!rightPass)
    throw new Error(EM_WRONG_PASS)
  if(inGame)
    throw new Error(EM_GAME_PROCESS)

  needRoom.addPlayer(finder)
  return [needRoom,finder]
}

function start_game(data){
  const dataSG = data

  const roomInGame = Server.getRoomByID(dataSG.roomID)
  roomInGame.startGame()

  roomInGame.getLog().setLog(ChatLog.WHO_HOST, "Выберите карты")

  return roomInGame
}

function choose_card(data){
  const dataIG = data

  const needRoom = Server.getRoomByID(dataIG.roomID)
  const gameInRoom = needRoom.getGame()

  const player = needRoom.getPlayerByID(dataIG.idPlayer)

  gameInRoom.createRole(player,dataIG.cardIndex)

  return needRoom
}

function readiness(data){
  const dataIG2 = data

  const needRoom = Server.getRoomByID(dataIG2.roomID)
  const gameInRoom = needRoom.getGame()

  const player = gameInRoom.getPlayerByID(dataIG2.idPlayer)
  gameInRoom.addReadyPlayerWithoutNextPhase(player)

  return needRoom
}

function vote_night(data){
  const dataIG3 = data

  const needRoom = Server.getRoomByID(dataIG3.roomID)
  const gameInRoom = needRoom.getGame()

  const mafia = gameInRoom.getPlayerByID(dataIG3.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG3.idChosen)
  if(!needRoom.getTimerIdByKey(Room.TK_PHASE))
    gameInRoom.setVoteNightWithoutNextPhase(mafia,player)
  else
    throw new Error(EM_VOTE_ON_TIMER)

  return needRoom
}

function vote(data){
  const dataIG4 = data

  const needRoom = Server.getRoomByID(dataIG4.roomID)
  const gameInRoom = needRoom.getGame()

  const voter = gameInRoom.getPlayerByID(dataIG4.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG4.idChosen)
  if(!needRoom.getTimerIdByKey(Room.TK_PHASE))
    gameInRoom.setVoteWithoutNextPhase(voter,player)
  else
    throw new Error(EM_VOTE_ON_TIMER)


  const log = needRoom.getLog()
  const newSpeaker = gameInRoom.getPlayerSpeaker()
  log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByVote(voter,player))
  if(newSpeaker)
    log.setLog(ChatLog.WHO_HOST, log.getHostPhraseBySpeaker(newSpeaker))

  return needRoom
}

function quit(data){
  const dataIG6 = data

  const needRoom = Server.getRoomByID(dataIG6.roomID)
  const error = needRoom.hasAnyTimer() //if timers not exists return false
  needRoom.clearAllTimers()

  const player = needRoom.getPlayerByID(dataIG6.idPlayer)
  needRoom.quitPlayer(player)

  return [needRoom, error]
}


export {create_room, find_room, start_game, choose_card, readiness, vote_night, vote, quit}