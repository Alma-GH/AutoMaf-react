const {
  E_READINESS,
  E_START_GAME,
  E_TIMER,
  E_VOTE,
  E_VOTE_NIGHT,
  TO_VOTE, T_VOTE
} = require("../utils/const.js");
const Room = require("../class/Room.js");
const ChatLog = require("../class/ChatLog.js");
const Game = require("../class/Game.js");
const {broadcast, broadcastClear} = require("./send.js");
const {getRandomIntInclusive} = require("../utils/func");
const StatisticController = require("../statisticController.js")



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

function startTimerToTakeVote(room,time,timeout){

  function func(){
    if(time===0){
      room.clearTimer(Room.TK_RT_VOTE)
      startTimerToNextPhaseOnVote(room,T_VOTE,TO_VOTE)
    }

    broadcast({event:E_TIMER, timer: {name:Room.TK_RT_VOTE, time}}, room.roomID)
    time-=1
  }
  func()
  room.setTimerID(func, timeout, Room.TK_RT_VOTE)
}

function startHideTimerToNextPhase(room,time,timeout){
  //TODO: mb dependence of num players with match role
  const min = 3
  const max = 7
  const randTime = getRandomIntInclusive(min,max) * 1000

  //TODO: mb bag -> add timout in room
  setTimeout(()=>startTimerToNextPhaseOnVoteNight(room,time,timeout), randTime)
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



function startTimerToGame(time, timeout, room){

  function func(){
    if(time===0){
      room.clearTimer(Room.TK_START)
      if(room.getStatus())
        broadcastClear({event:E_START_GAME, room}, room.roomID)
    }
    broadcast({event:E_TIMER, timer: {name:Room.TK_START, time}}, room.roomID)
    time-=1
  }
  func()
  room.setTimerID(func, timeout, Room.TK_START)
}

function startTimerToNextPhaseOnVote(room,time,timeout){
  //TODO: condition on some suspects
  const choice = room.getGame().choiceVotes()

  const startLog = log=>{
    //TODO: mb add log.setLog(ChatLog.WHO_HOST, `${numVotes} из ${all}`)
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
    StatisticController.updatePlayersStatistic(game)
  }

  startTimerToNextPhase(room,E_VOTE,time,timeout, startLog, endLog, nextPhase)
}

function startTimerToNextPhaseOnVoteNight(room,time,timeout){
  const game = room.getGame()
  const phase = game.getPhase()
  const choice = game.choiceVotesNight()
  const deadPlayer = phase===Game.PHASE_NIGHT_MAFIA
    ? choice
    : game.getPlayersInjured().find(player=>{
      if(phase === Game.PHASE_NIGHT_DOCTOR && choice === player)
        return false
      return player.isLive()
    })

  const startLog = log=>{

    log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByEndNightPhase(phase))

    if(game.isLastNightPhase())
      log.setLog(ChatLog.WHO_HOST, "К сожалению город просыпается без ...")
  }
  const endLog = log=>{
    if(game.isLastNightPhase()){
      if(deadPlayer)
        log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByDeadPlayer(deadPlayer))
      else
        log.setLog(ChatLog.WHO_HOST, log.getHostPhraseOnZeroDeadPlayers())
    }

  }
  const nextPhase = game=>{
    game.nextPhaseByNightVote()
    newPhaseLog(room)
    const isNight = game.isNightPhase()
    const noPlayers =!game.havePlayersOnNightPhase()
    const alreadyDetected = game.allAlreadyDetected()
    const isDetNight = (game.getPhase() === Game.PHASE_NIGHT_DETECTIVE)

    if(isNight && (noPlayers || (alreadyDetected && isDetNight)))
      startHideTimerToNextPhase(room,time,timeout)
    gameEndLog(room)
    StatisticController.updatePlayersStatistic(game)
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
    newPhaseLog(room)
  }

  startTimerToNextPhase(room,E_READINESS,time,timeout, startLog, endLog, nextPhase)
}

function controlTimerToTakeVote(room,time,timeout){

  const game = room.getGame()

  //TODO: mb bag
  if(game.isEndVote()){
    if(!room.getTimerIdByKey(Room.TK_RT_VOTE))
      startTimerToTakeVote(room, time, timeout)
  }else{
    room.clearTimer(Room.TK_RT_VOTE)
    broadcast({
      event: E_TIMER,
      timer: {name: Room.TK_RT_VOTE, time: 0}
    }, room.roomID)
  }
}



module.exports = {
  startTimerToGame,
  startTimerToNextPhaseOnVote,
  startTimerToNextPhaseOnVoteNight,
  startTimerToNextPhaseOnReadiness,
  controlTimerToTakeVote
}