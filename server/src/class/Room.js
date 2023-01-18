const Game = require("./Game.js");
const ChatLog = require("./ChatLog.js");
const Checker = require("./TypeCheckers/TCRoom.js")


class Room {

  static newID = 0
  roomID

  players
  newPlayerID
  maxPlayers

  name
  isSetPass
  password

  inGame
  game

  log

  timer
  static TK_START = "timer_key_start"
  static TK_PHASE = "timer_key_next_phase"
  static TK_JUDGED = "timer_key_next_judged"

  static TK_RT_VOTE = "timer_key_realtime_vote"

  // static TK_SECRET = "timer_key_secret"


  gameOptions

  constructor(leader, maxP, name, pass) {
    //init
    this.roomID = Room.newID++
    this.players = []
    this.newPlayerID = 0
    this.isSetPass = false
    this.setName(name)
    this.setMaxPlayers(maxP)
    if(pass !== null)
      this.setPass(pass)
    this.inGame = false

    this.addPlayer(leader)

    this.log = new ChatLog()
    this.timer = {}
    this.gameOptions = {
      voteType: Game.VOTE_TYPE_REALTIME
    }
  }

  getID(){
    return this.roomID
  }

  getName(){
    return this.name
  }
  setName(name){
    Checker.check_setName(name)

    this.name = name
  }

  getPass(){
    if(this.isSetPass) return this.password
    else               return null
  }
  setPass(pass){
    Checker.check_setPass(pass)

    this.password = pass
    this.isSetPass = true
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

    //add id in room for player
    player.setID(this.newPlayerID++)
    //add player in room
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
    this.inGame = false

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
    Checker.check_setOptions(options)

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
  clearTimer(key){
    clearInterval(this.getTimerIdByKey(key))
    delete this.timer[key]
  }
  clearAllTimers(){
    for (const key in this.timer) {
      this.clearTimer(key)
    }
  }


  toString(){
    return JSON.stringify({
      s_newID: Room.newID,

      roomID: this.roomID,

      players: this.players.map(player=>player.toString()),
      newPlayerID: this.newPlayerID
    },null,2)
  }
}

module.exports = Room

