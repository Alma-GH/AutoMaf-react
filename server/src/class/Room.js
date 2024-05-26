const Game = require("./Game.js");
const ChatLog = require("./ChatLog.js");
const Checker = require("./TypeCheckers/TCRoom.js")
const { v4: uuidv4 } = require('uuid');


class Room {

  roomID

  players
  maxPlayers

  inGame
  game

  log

  timer
  static TK_START = "timer_key_start"
  static TK_PHASE = "timer_key_next_phase"

  static TK_RT_VOTE = "timer_key_realtime_vote"

  // static TK_SECRET = "timer_key_secret"
  static TK_RECONNECT = "timer_key_reconnect_"


  gameOptions

  constructor(leader, maxP) {
    //init
    this.roomID = uuidv4()
    this.players = []
    this.setMaxPlayers(maxP)
    this.inGame = false

    this.addPlayer(leader)

    this.log = new ChatLog()
    this.timer = {}
    this.gameOptions = {
      voteType: Game.VOTE_TYPE_REALTIME,

      autoRole: true,
      numDet: 1,
      numDoc: 1,
      numMaf: 1,
    }
  }

  getID(){
    return this.roomID
  }

  getMaxPlayers(){
    return this.maxPlayers
  }
  setMaxPlayers(num){
    Checker.check_setMaxPlayers(num)

    this.maxPlayers = num
  }

  getPlayers(){
    return this.players
  }
  getPlayerByID(id){
    Checker.check_getPlayerByID(this,id)

    return this.getPlayers().find(player=>player.getID()===id)
  }
  addPlayer(player){
    Checker.check_addPlayer(this,player)

    this.players.push(player)
  }
  quitPlayer(player){
    Checker.check_quitPlayer(this,player)

    this.players = this.players
      .filter(pl=>pl.getID()!==player.getID())

    /*
      TODO: after kill if no end
       prepare phase - restart game
       discussion phase - check ready players
       night(maf) phase - check night votes
       (sub)total phase - check votes
    */
    // this.game._killPlayer(//player from game//)

    // if(!this.players.length)
    //   Server.closeRoom(this.roomID)
    //temp
    this.stopGame()

    const l = this.getLog()
    l.setLog(ChatLog.WHO_LOG, l.getLogPhraseByQuitPlayer(player))
  }

  getStatus(){
    return this.inGame
  }
  _toggleStatus(){
    this.inGame = !this.inGame
  }

  getGame(){
    return this.game
  }
  startGame(){
    Checker.check_startGame(this)
    Checker.check_setOptions(this, true,this.getOptions())

    this.game = new Game(this)
    this.inGame = true

    this.log.clear()
    this.log.setLog(ChatLog.WHO_LOG, "Игра запущена")
  }
  stopGame(){
    this.inGame = false
    this.game = null
  }

  getOptions(){
    return this.gameOptions
  }
  setOptions(options){
    Checker.check_setOptions(this, false,options)
    this.gameOptions = options
  }

  getLog(){
    return this.log
  }

  getAllTimers(){
    return this.timer
  }
  getTimerIdByKey(key){
    return this.timer[key]
  }
  hasAnyTimer(){
    return !!Object.getOwnPropertyNames(this.getAllTimers()).length
  }
  setTimerID(cb, timeout,key){
    this.timer[key] = setInterval(cb, timeout)
  }
  setTimeoutID(cb, timeout,key){
    this.timer[key] = setTimeout(cb, timeout)
  }
  clearTimer(key){
    if(![Room.TK_START, Room.TK_PHASE, Room.TK_RT_VOTE].includes(key))
      return
    clearInterval(this.getTimerIdByKey(key))
    delete this.timer[key]
  }
  clearTimeout(key){
    clearTimeout(this.getTimerIdByKey(key))
    delete this.timer[key]
  }
  clearAllTimers(){
    for (const key in this.timer) {
      this.clearTimer(key)
    }
  }


  toString(){
    return JSON.stringify({
      roomID: this.roomID,

      players: this.players.map(player=>player.toString()),
    },null,2)
  }
}

module.exports = Room

