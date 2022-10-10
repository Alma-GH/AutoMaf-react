const {
  EM_MAX_PLAYERS,
  DEF_MIN_PLAYERS,
  EM_SET_PLAYERS_LOW,
  DEF_MAX_PLAYERS,
  EM_SET_PLAYERS_HIGH,
  EM_NULL_NAME_ROOM,
  EM_UNIQUE_NAME,
  EM_PASS_ROOM,
  EM_START_GAME,
  EM_START_ALREADY
} = require("../../utils/const.js");
const Player = require("../Player.js");
const Server = require("../Server.js");



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

module.exports = new TypeChecker()