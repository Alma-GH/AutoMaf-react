import Player from "./Player.js";
import Server from "./Server.js";
import Game from "./Game.js";

const DEF_MAX_PLAYERS = 4

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

  //TODO: options
  gameOptions


  constructor(leader, maxP, name, pass) {
    //init
    this.roomID = Room.newID++
    this.players = []
    this.newPlayerID = 0
    this.setMaxPlayers(maxP)
    this.setName(name)
    this.setPass(pass)
    this.inGame = false

    this.addPlayer(leader)
  }

  getID(){
    return this.roomID
  }

  getName(){
    return this.name
  }
  setName(name){
    const isStr = (typeof name === "string")
    const isGT  = isStr ? (name.length > 0) : false
    const isUni = (!Server.getRoomsNames().includes(name))

    if(isStr && isGT && isUni)  this.name = name
    else                        throw new Error("Room: name error")
  }

  getPass(){
    if(this.isSetPass) return this.password
    else               return null
  }
  setPass(pass){
    const isStr      = (typeof pass === "string")
    const isNotShort = isStr ? (pass.length>2) : false

    if(isStr && isNotShort){
      this.password = pass
      this.isSetPass = true
    }else{
      this.isSetPass = false
    }
  }

  getMaxPlayers(){
    return this.maxPlayers
  }
  setMaxPlayers(num){
    const isNum = (typeof num === "number")
    const isGT  = (num >= DEF_MAX_PLAYERS)

    if(isNum && isGT)   this.maxPlayers = num
    else{
      this.maxPlayers = DEF_MAX_PLAYERS
      console.log("ERROR: MAX PLAYERS IN ROOM")
    }
  }

  getPlayers(){
    return this.players
  }
  getPlayerByID(id){
    return this.getPlayers().find(player=>player.getID()===id)
  }
  addPlayer(player){
    //TODO: change check type
    //TODO: check max player

    //check type
    if(!(player instanceof Player) || this.getPlayers().some(pl=>pl.getID() === player.getID()))
      throw new Error("Type error: Room.addPlayer(player)")

    //add id in room for player
    player.setID(this.newPlayerID++)
    //add player in room
    this.players.push(player)
  }
  quitPlayer(player){
    //TODO: validate
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
    this.game = new Game(this)
    this.inGame = true
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