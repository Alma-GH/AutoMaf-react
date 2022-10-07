import Room from "../class/Room.js";
import ChatLog from "../class/ChatLog.js";
import Game from "../class/Game.js";

import {E_NEXT_JUDGED, E_READINESS, E_START_GAME, E_TIMER, E_VOTE, E_VOTE_NIGHT} from "./const.js";
import {broadcast, broadcastClear} from "./send.js";



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
  const time = 10000
  const log = room.getLog()
  const game = room.getGame()


  function questionJudged(){
    const newJudged = game.getPlayerJudged()
    if(newJudged && !room.getTimerIdByKey(Room.TK_PHASE))
      log.setLog(ChatLog.WHO_HOST, log.getHostPhraseByJudged(newJudged))
    return newJudged
  }

  function func(){
    const judged    = game.getPlayerJudged()
    const numVotes  = game.getPlayersVoted().filter(player=>player.vote === judged).length
    const all       = game.getPlayersAlive().length - 1
    if(judged && !room.getTimerIdByKey(Room.TK_PHASE))
      log.setLog(ChatLog.WHO_HOST, `${numVotes} из ${all}`)

    game.nextJudged()

    if(!questionJudged())
      room.clearTimer(Room.TK_JUDGED)

    if(!game.end)
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



export {startTimerToGame, startTimerToNextPhaseOnVote,
  startTimerToNextPhaseOnVoteNight, startTimerToNextPhaseOnReadiness}