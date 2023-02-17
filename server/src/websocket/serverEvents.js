const {
  EM_GAME_PROCESS,
  EM_VOTE_ON_TIMER,
  EM_WRONG_PASS } = require("../utils/const.js");
const Player = require("../class/Player.js");
const Room = require("../class/Room");
const Server = require("../class/Server.js");
const ChatLog = require("../class/ChatLog.js");
const Game = require("../class/Game");
const {EM_ENTER_AGAIN} = require("../utils/const");


function set_settings(data){
  const dataSS = data

  const roomInGame = Server.getRoomByID(dataSS.roomID)
  delete data.roomID
  delete data.event
  roomInGame.setOptions(data)

  return roomInGame
}

function create_room(data){
  const dataCR = data
  const {
    nameCreator,
    numPlayers,
    nameRoom,
    existPassword,
    password,
    gameOptions
  } = dataCR

  const leader = new Player(nameCreator)
  const newRoom = new Room(
    leader,
    numPlayers,
    nameRoom,
    existPassword ? password : null
  )
  newRoom.setOptions(gameOptions)
  Server.addRoom(newRoom)

  return [newRoom,leader]
}

function find_room(data){
  const dataFR = data
  const {
    nameFinder,
    nameRoom,
    passRoom,
    idFinder
  } = dataFR

  const finder        = new Player(nameFinder)
  const needRoom      = Server.getRoomByName(nameRoom)
  //TODO: Room.tryConnect()
  const rightPass = needRoom.getPass() ? needRoom.getPass() === passRoom : true
  const inGame = needRoom.getStatus() || needRoom.getTimerIdByKey(Room.TK_START)

  if(!rightPass)
    throw new Error(EM_WRONG_PASS)
  if(inGame)
    throw new Error(EM_GAME_PROCESS)
  if(needRoom
    .getPlayers()
    .map(player=>(needRoom.getID() + "_" + player.getID()))
    .includes(idFinder)
  )
    throw new Error(EM_ENTER_AGAIN)

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

function stop_game(data){
  const dataIG0 = data

  const room = Server.getRoomByID(dataIG0.roomID)
  room.stopGame()

  return room
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

  const voter = gameInRoom.getPlayerByID(dataIG3.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG3.idChosen)
  if(!needRoom.getTimerIdByKey(Room.TK_PHASE))
    gameInRoom.setVoteNightWithoutNextPhase(voter,player)
  else
    throw new Error(EM_VOTE_ON_TIMER)

  return needRoom
}

function vote(data){
  const dataIG4 = data

  const needRoom = Server.getRoomByID(dataIG4.roomID)
  const gameInRoom = needRoom.getGame()

  const voter = gameInRoom.getPlayerByID(dataIG4.idVoter)
  const player = dataIG4.idChosen !== null
    ? gameInRoom.getPlayerByID(dataIG4.idChosen)
    : null
  if(!needRoom.getTimerIdByKey(Room.TK_PHASE))
    gameInRoom.setVoteWithoutNextPhase(voter,player)
  else
    throw new Error(EM_VOTE_ON_TIMER)


  const log = needRoom.getLog()
  const newSpeaker = gameInRoom.getPlayerSpeaker()

  if(gameInRoom.getVoteType() !== Game.VOTE_TYPE_REALTIME)
    log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByVote(voter,player))
  if(newSpeaker)
    log.setLog(ChatLog.WHO_HOST, log.getHostPhraseBySpeaker(newSpeaker))

  return [needRoom, player]
}

function quit(data){
  const dataIG6 = data

  const needRoom = Server.getRoomByID(dataIG6.roomID)
  const errorTimer = needRoom.hasAnyTimer() //if timers not exists return false
  const errorQuit = needRoom.getStatus()
  needRoom.clearAllTimers()

  const player = needRoom.getPlayerByID(dataIG6.idPlayer)
  needRoom.quitPlayer(player)

  return [needRoom, errorTimer, errorQuit]
}


function get_room(data){
  const dataGR = data

  const needRoom = Server.getRoomByID(dataGR.roomID)
  const player = needRoom.getPlayerByID(dataGR.idPlayer)

  return [needRoom,player]
}


module.exports = {
  set_settings,
  create_room,
  find_room,
  start_game,
  stop_game,
  choose_card,
  readiness,
  vote_night,
  vote,
  quit,
  get_room
}