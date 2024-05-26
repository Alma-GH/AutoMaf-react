const {
  EM_MAX_PLAYERS,
  DEF_MIN_PLAYERS,
  EM_SET_PLAYERS_LOW,
  DEF_MAX_PLAYERS,
  EM_SET_PLAYERS_HIGH,
  EM_START_GAME,
  EM_START_ALREADY
} = require("../../utils/const.js");
const Player = require("../Player.js");
const Game = require("../Game");
const {EM_MANY_MAF, EM_MANY_SPEC, EM_NO_MAF, EM_ENTER_AGAIN} = require("../../utils/const");



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
      throw new Error(EM_ENTER_AGAIN)

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


    if(![Game.VOTE_TYPE_REALTIME].includes(opt.voteType))
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

    const isString  = (typeof id === "string")

    return isString
  }
  check_getPlayerByID(room,...args){
    if(!this.checkArgs_getPlayerByID(...args))
      throw new Error("incorrect request Player by id")

    const id = args[0]

    if(!room.getPlayers().find(player=>player.getID()===id))
      throw new Error("this player not exist")
  }
}

module.exports = new TypeChecker()