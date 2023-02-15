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
const Game = require("../Game");
const {EM_MANY_MAF, EM_MANY_SPEC, EM_NO_MAF} = require("../../utils/const"); //TODO: check on error



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
    if(room.getTimerIdByKey(room.constructor.TK_START))
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

  checkArgs_setOptions(...args){
    if(args.length!==1) return false

    const options = args[0]

    const isObj = typeof options === "object"

    const needKeys = [
      "voteType",
      "autoRole",
      "numMaf",
      "numDoc",
      "numDet"
    ] //TODO: change for more options
    const numKeys = Object.keys(options).length
    const correctKeys = needKeys.every(key=>key in options)
    const checksNumber = [
      typeof options["numMaf"],
      typeof options["numDet"],
      typeof options["numDoc"]
    ].every(type=>type==="number")
    const checksString = typeof options["voteType"] === "string"
    const checksBool = typeof options["autoRole"] === "boolean"
    const typeChecks = checksString && checksNumber && checksBool

    return isObj && correctKeys && (numKeys === needKeys.length) && typeChecks
  }
  check_setOptions(room, isStart,...args){
    if(!this.checkArgs_setOptions(...args))
      throw new Error("incorrect options")

    const opt = args[0]

    //DEP NIGHT PHASES 3
    const numPlayers = isStart ? room.getPlayers().length : room.getMaxPlayers()
    const numMaf = opt.numMaf
    const numDoc = opt.numDoc
    const numDet = opt.numDet
    const autoRole = opt.autoRole

    const manySpecRoles = numMaf + numDoc + numDet >= numPlayers
    const manyMaf = numMaf>=numPlayers/2
    const noMaf   = numMaf === 0


    if(![Game.VOTE_TYPE_REALTIME, Game.VOTE_TYPE_CLASSIC, Game.VOTE_TYPE_FAIR].includes(opt.voteType))
      throw new Error("vote type in options not exist")
    if(![opt.numMaf, opt.numDet, opt.numDoc].every(num => num>= 0))
      throw new Error("number players with role < 0")
    if(!autoRole){
      if(manyMaf)
        throw new Error(EM_MANY_MAF)
      if(manySpecRoles)
        throw new Error(EM_MANY_SPEC)
      if(noMaf)
        throw new Error(EM_NO_MAF)
    }

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