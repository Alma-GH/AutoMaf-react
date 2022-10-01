import Player from "./Player.js";
import Server from "./Server.js";
import Game from "./Game.js";
import {
  DEF_MAX_PLAYERS,
  DEF_MIN_PLAYERS,
  EM_MAX_PLAYERS,
  EM_NULL_NAME_ROOM, EM_PASS_ROOM,
  EM_SET_PLAYERS_HIGH,
  EM_SET_PLAYERS_LOW, EM_START_ALREADY, EM_START_GAME,
  EM_UNIQUE_NAME
} from "../utils/const.js";
import ChatLog from "./ChatLog.js";


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

  static LIVE_TIME = 1000*60*60*24 //1day

  //TODO: options
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

    if(!this.players.length)
      Server.closeRoom(this.roomID)
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

  startLive(){
    setTimeout(()=>Server.closeRoom(this.roomID), Room.LIVE_TIME)
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

export default Room


class TypeChecker{

  //client setters
  checkArgs_addPlayer(...args){
    if(args.length!==1) return false

    const player = args[0]

    const isPlayer  = (player instanceof Player)

    return isPlayer
  }
  check_addPlayer(room,...args){
    if(!this.checkArgs_addPlayer(...args))
      throw new Error("is not a Player")

    const player = args[0]

    if(room.getPlayers().some(pl=>pl.getID() === player.getID()))
      throw new Error("this player already in room")

    if(room.players.length+1 > room.maxPlayers)
      throw new Error(EM_MAX_PLAYERS)
  }

  checkArgs_setMaxPlayers(...args){
    if(args.length!==1) return false

    const num = args[0]

    const isNum = (typeof num === "number")
    const isInt = Number.isInteger(num)

    return isNum && isInt
  }
  check_setMaxPlayers(...args){
    if(!this.checkArgs_setMaxPlayers(...args))
      throw new Error("incorrect set max players")

    const num = args[0]

    if(num < DEF_MIN_PLAYERS)
      throw new Error(EM_SET_PLAYERS_LOW)
    if(num > DEF_MAX_PLAYERS)
      throw new Error(EM_SET_PLAYERS_HIGH)

  }

  checkArgs_setName(...args){
    if(args.length!==1) return false

    const name = args[0]

    const isStr = (typeof name === "string")

    return isStr
  }
  check_setName(...args){
    if(!this.checkArgs_setName(...args))
      throw new Error("incorrect set name room")

    const name = args[0]

    if(!name.length)
      throw new Error(EM_NULL_NAME_ROOM)
    //TODO: in Server
    if(Server.getRoomsNames().includes(name))
      throw new Error(EM_UNIQUE_NAME)
  }

  checkArgs_setPass(...args){
    if(args.length!==1) return false

    const pass = args[0]

    const isStr = (typeof pass === "string")

    return isStr
  }
  check_setPass(...args){
    if(!this.checkArgs_setPass(...args))
      throw new Error("incorrect set pass room")

    const pass = args[0]

    if(pass.length <= 2)
      throw new Error(EM_PASS_ROOM)
  }

  check_startGame(room){
    if(room.getPlayers().length < DEF_MIN_PLAYERS)
      throw new Error(EM_START_GAME)
    if(room.getTimerIdByKey(Room.TK_START))
      throw new Error(EM_START_ALREADY)
  }

  checkArgs_quitPlayer(...args){
    if(args.length!==1) return false

    const player = args[0]

    const isPlayer  = (player instanceof Player)

    return isPlayer
  }
  check_quitPlayer(room,...args){
    if(!this.checkArgs_quitPlayer(...args))
      throw new Error("is not a Player")

    const player = args[0]

    if(!room.getPlayers().find(pl=>pl.getID()===player.getID()))
      throw new Error("this player not exist")
  }


  //client getters
  checkArgs_getPlayerByID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isNum  = (typeof id === "number")
    const isInt  = Number.isInteger(id)

    return isNum && isInt
  }
  check_getPlayerByID(room,...args){
    if(!this.checkArgs_getPlayerByID(...args))
      throw new Error("incorrect request Player by id")

    const id = args[0]

    if(!room.getPlayers().find(player=>player.getID()===id))
      throw new Error("this player not exist")
  }


  //class methods
}

const Checker = new TypeChecker()
