import {WebSocketServer} from "ws";
import Player from "./class/Player.js";
import Room from "./class/Room.js";
import Server from "./class/Server.js";
import {
  E_CHOOSE_CARD,
  E_CREATE_ROOM, E_ERROR,
  E_FIND_ROOM, E_NEXT_JUDGED, E_PLAYER_DATA, E_QUIT,
  E_READINESS,
  E_START_GAME, E_TIMER,
  E_VOTE,
  E_VOTE_NIGHT, EM_UNEXPECTED_QUIT, EM_VOTE_ON_TIMER, EM_WRONG_PASS
} from "./utils/const.js";
import Onside from "./class/Onside.js";
import Game from "./class/Game.js";
import ChatLog from "./class/ChatLog.js";


const wss = new WebSocketServer({
  port:5000,
}, ()=>console.log("Server started on port 5000"))

wss.on('connection', function connection(ws) {

  ws.on('message', function (message) {
    try{
      //TODO: check event
      //TODO: add reconnect
      message = JSON.parse(message)

      let room
      let player
      let error
      switch (message.event) {
        case E_CREATE_ROOM:
          [room,player] = create_room(message)
          ws.id = room.roomID
          single(ws, {event:E_CREATE_ROOM, room})
          single(ws, {event:E_PLAYER_DATA, player})
          single(ws,{event:E_TIMER, time:0}, room.roomID)
          break;
        case E_FIND_ROOM:
          [room,player] = find_room(message)
          ws.id = room.roomID
          if(room.game)
            broadcastClear({event:E_FIND_ROOM, room}, room.roomID)
          else
            broadcast({event:E_FIND_ROOM, room},room.roomID)
          single(ws, {event:E_PLAYER_DATA, player})
          single(ws,{event:E_TIMER, time:0}, room.roomID)
          break;
        case E_START_GAME:
          room = start_game(message)
          startTimerToGame(5,750,room)
          break;
        case E_CHOOSE_CARD:
          room = choose_card(message)
          broadcastClear({event:E_CHOOSE_CARD, room}, room.roomID)
          break;
        case E_READINESS:
          room = readiness(message)
          broadcastClear({event:E_READINESS, room}, room.roomID)

          if(room.getGame()._allPlayersReady())
            startTimerToNextPhaseOnReadiness(room,3,1000)

          break;
        case E_VOTE_NIGHT:
          room = vote_night(message)
          broadcastClear({event:E_VOTE_NIGHT, room}, room.roomID)

          if(room.getGame()._allPlayersVoteNight())
            startTimerToNextPhaseOnVoteNight(room,3,1000)
          break;
        case E_VOTE:
          room = vote(message)
          broadcastClear({event:E_VOTE, room}, room.roomID)

          if(room.getGame()._allPlayersVote())
            startTimerToNextPhaseOnVote(room,3,1000)
          break;
        case E_QUIT:
          [room, error] = quit(message)
          delete ws.id
          if(room.game)
            broadcastClear({event:E_QUIT, room}, room.roomID)
          else
            broadcast({event:E_QUIT, room},room.roomID)

          broadcast({event:E_TIMER, time:0}, room.roomID)
          if(error)
            broadcast({event: E_ERROR,message: EM_UNEXPECTED_QUIT}, room.roomID)
          break;

        //no need
        // case E_NEXT_JUDGED:
        //   room = nextJudged(message)
        //   broadcastClear(room, room.roomID)
        //   break;
      }
    }catch (e){
      console.log(e)
      single(ws,{event: E_ERROR,message: e.message})
    }

  })
})


//send

function single(client, message){
  client.send(JSON.stringify(message))
}

function broadcast(message, id) {
  wss.clients.forEach(client => {
    if(id===undefined || client.id === id)
      client.send(JSON.stringify(message))
  })
}

function broadcastClear(message,id){
  const room = message.room
  const game = room.getGame()

  //tmp
  const table = game.tableVotes
  const votes = game.players.map(player=>player.vote)
  const log   = game.log
  const timer = room.timer

  //clear/adaptive
  game.tableVotes = Array.from(game.getTable().entries())
    .map(row=>{
      const voter = row[0]
      const vote = row[1]
      return [voter.getID(), vote instanceof Onside ? vote.getID() : vote]
    })
  //TODO: crutch - after make voting by id
  game.players.forEach(player=>{
    if(player.vote instanceof Onside)
      player.vote = player.vote._id
  })
  game.log = undefined
  room.timer = null

  broadcast({event:message.event, room},id)

  //return values
  game.tableVotes = table
  game.players.forEach((player,ind)=> {
    player.vote = votes[ind]
  })
  game.log = log
  room.timer = timer
}


//server events

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
  const isConnectable = needRoom.getPass() ? needRoom.getPass() === dataFR.passRoom : true

  if(isConnectable){
    needRoom.addPlayer(finder)
    return [needRoom,finder]
  }else{
    throw new Error(EM_WRONG_PASS)
  }

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
  gameInRoom.setVoteWithoutNextPhase(voter,player)

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


//no need
function nextJudged(data){
  const dataIG5 = data

  const needRoom = Server.getRoomByID(dataIG5.roomID)
  const gameInRoom = needRoom.getGame()

  gameInRoom.nextJudged()

  return needRoom
}




//timers
function startTimerToGame(time, timeout, room){

  function func(){
    if(time===0){
      room.clearTimer(Room.TK_START)
      if(room.getStatus())
        broadcastClear({event:E_START_GAME, room}, room.roomID)
    }
    broadcast({event:E_TIMER, time}, room.roomID)
    time-=1
  }
  func()
  room.setTimerID(func, timeout, Room.TK_START)
}

function startTimerToNextPhase(room,event,time,timeout, startLog,endLog,nextPhase){
  const log = room.getLog()
  const game = room.getGame()
  startLog(log)


  function func(){
    if(time===0){
      room.clearTimer(Room.TK_PHASE)
      log.setLog(ChatLog.WHO_HOST, time)
      endLog(log)

      nextPhase(game)

      broadcastClear({event, room}, room.roomID)
    }else{
      log.setLog(ChatLog.WHO_HOST, time)
      time -= 1
      broadcastClear({event, room}, room.roomID)
    }
  }

  func()
  room.setTimerID(func, timeout, Room.TK_PHASE)
}

function startTimerToJudgedPath(room){
  //TODO: FIX BUG
  const time = 10000
  const log = room.getLog()
  const game = room.getGame()


  function questionJudged(){
    const newJudged = game.getPlayerJudged()
    if(newJudged)
      log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByJudged(newJudged))
    return newJudged
  }

  function func(){
    const judged    = game.getPlayerJudged()
    const numVotes  = game.getPlayersVoted().filter(player=>player.vote === judged).length
    const all       = game.getPlayersAlive().length - 1
    log.setLog(ChatLog.WHO_HOST, `${numVotes} из ${all}`)

    game.nextJudged()

    if(!questionJudged())
      room.clearTimer(Room.TK_JUDGED)

    broadcastClear({event:E_NEXT_JUDGED, room}, room.roomID)
  }

  questionJudged()

  room.setTimerID(func,time,Room.TK_JUDGED)
}


function newPhaseLog(room){
  if(!room)
    return

  const log = room.getLog()
  const game = room.getGame()
  const phase = game.getPhase()

  log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByPhase(phase))
  if(phase === Game.PHASE_DAY_SUBTOTAL){
    const speaker = game.getPlayerSpeaker()
    log.setLog(ChatLog.WHO_HOST, log.getHostPhraseBySpeaker(speaker))
  }
}
function gameEndLog(room){
  if(!room)
    return

  const log = room.getLog()
  const game = room.getGame()

  if(game.end === Game.MAFIA_WIN)
    log.gameEnd("Мафия одерживает победу")
  else if(game.end === Game.CIVIL_WIN)
    log.gameEnd("Мирные одерживают победу")
}


function startTimerToNextPhaseOnVote(room,time,timeout){
  //TODO: condition on some suspects
  const choice = room.getGame()._choiceVotes()

  const startLog = log=>{
    log.setLog(ChatLog.WHO_HOST, "Голосование окончено")
    if(choice)
      log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByJailed(choice))
  }
  const endLog = log=>{
    if(!choice)
      log.setLog(ChatLog.WHO_HOST,
        "Продолжайте обсуждение. Я подожду когда вы будете готовы к окончательному голосованию")
  }
  const nextPhase = game=>{
    game.nextPhaseByVote()
    gameEndLog(room)
  }

  startTimerToNextPhase(room,E_VOTE,time,timeout, startLog, endLog, nextPhase)
}

function startTimerToNextPhaseOnVoteNight(room,time,timeout){
  const choice = room.getGame()._choiceVotesNight()

  const startLog = log=>{
    log.setLog(ChatLog.WHO_HOST, "Мафия сделала свой выбор")
    log.setLog(ChatLog.WHO_HOST, "К сожалению город просыпается без ...")
  }
  const endLog = log=>{
    log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByDeadPlayer(choice))
  }
  const nextPhase = game=>{
    game.nextPhaseByNightVote()
    gameEndLog(room)
  }

  startTimerToNextPhase(room,E_VOTE_NIGHT,time,timeout, startLog, endLog, nextPhase)
}

function startTimerToNextPhaseOnReadiness(room,time,timeout){

  const startLog = log=>{
    log.setLog(ChatLog.WHO_HOST, "Полная готовность")
  }
  const endLog = log=>{}
  const nextPhase = game=>{
    game.nextPhaseByReadyPlayers()
    const phase = game.getPhase()
    newPhaseLog(room)
    if(phase === Game.PHASE_DAY_TOTAL)
      startTimerToJudgedPath(room)
  }

  startTimerToNextPhase(room,E_READINESS,time,timeout, startLog, endLog, nextPhase)
}



