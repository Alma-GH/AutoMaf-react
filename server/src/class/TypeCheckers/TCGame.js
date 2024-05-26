const {
  EM_GAME_CHOOSE,
  EM_CHOOSE_NULL,
  EM_READY,
  EM_VOTE,
  EM_PLAYER_DEAD,
  EM_VOTE_FOR,
  EM_VOTE_PHASE
} = require("../../utils/const.js");
const Player = require("../Player.js");
const Onside = require("../Onside.js");


class TypeChecker{

  //client setters
  checkArgs_createRole(...args){
    if(args.length!==2) return false

    const player = args[0]
    const cardIndex = args[1]

    const isPlayer  = (player instanceof Player) && !(player instanceof Onside)

    const isNum     = typeof cardIndex === "number"
    const isInt     = Number.isInteger(cardIndex)

    return (isPlayer && isNum && isInt)
  }
  check_createRole(game,...args){
    if(!this.checkArgs_createRole(...args))
      throw new Error("incorrect arg-s in create role")

    const player = args[0]
    const cardIndex = args[1]

    if((cardIndex < 0) || (cardIndex >= game.cards.length))
      throw new Error("this not card index")

    if(game.players.some(onside=>onside.getID()===player.getID()))
      throw new Error(EM_GAME_CHOOSE)

    if(game.getCards()[cardIndex] === null)
      throw new Error(EM_CHOOSE_NULL)
  }

  checkArgs_addReadyPlayer(...args){
    if(args.length!==1) return false

    const player = args[0]

    const isOnside  = (player instanceof Onside)

    return isOnside
  }
  check_addReadyPlayer(game,...args){
    if(!this.checkArgs_addReadyPlayer(...args))
      throw new Error("is not a Player")

    const player = args[0]

    if(game.getPlayersReadiness().includes(player))
      throw new Error(EM_READY)

    if(!game.getPlayersAlive().includes(player))
      throw new Error("this player not alive")

    if(![game.constructor.PHASE_DAY_DISCUSSION,game.constructor.PHASE_PREPARE].includes(game.getPhase()))
      throw new Error("not allowed in this phase")
  }

  checkArgs_setVoteNight(...args){
    if(args.length!==2) return false

    const player  = args[0]
    const val     = args[1]

    const valIsNull   = (val === null)
    const valIsPlayer = (val instanceof Onside)
    const keyIsPlayer = (player instanceof Onside)

    return (valIsPlayer || valIsNull) && keyIsPlayer
  }
  check_setVoteNight(game,...args){
    if(!this.checkArgs_setVoteNight(...args))
      throw new Error("incorrect arg-s in set vote night")

    const voter = args[0]
    const val = args[1]

    //DEP NIGHT PHASES 3
    let voters = null
    let selfVote = false
    let docPhase = false
    let detPhase = false
    game._runFunctionsByPhase([
      ()=>{voters = game.getPlayersByRole(Onside.CARD_MAFIA)},
      ()=>{voters = game.getPlayersByRole(Onside.CARD_DETECTIVE); detPhase = true},
      ()=>{voters = game.getPlayersByRole(Onside.CARD_DOCTOR); selfVote = true; docPhase = true}
    ])

    //now throw from ._runFunctionsByPhase
    if(voters === null)
      throw new Error("not allowed in this phase")

    if(!game.getPlayersAlive().includes(voter))
      throw new Error(EM_VOTE)

    if(val ? !game.getPlayersAlive().includes(val) : false)
      throw new Error(EM_PLAYER_DEAD)

    if(!voters.includes(voter))
      throw new Error(EM_VOTE)

    if(voters.includes(val) && !selfVote)
      throw new Error(EM_VOTE_FOR)

    if(docPhase && val ? game.lastDocVote === val.getID() : false)
      throw new Error(EM_VOTE_FOR)

    if(detPhase && val ? val.isDetected() : false)
      throw new Error(EM_VOTE_FOR)
  }

  checkArgs_setVote(...args){
    if(args.length!==2) return false

    const player  = args[0]
    const val     = args[1]

    const valIsNull   = [false,null].includes(val)
    const valIsPlayer = (val instanceof Onside)
    const keyIsPlayer = (player instanceof Onside)

    return (valIsPlayer || valIsNull) && keyIsPlayer
  }
  check_setVote(game,...args){
    if(!this.checkArgs_setVote(...args))
      throw new Error("incorrect arg-s in set vote")

    const voter = args[0]
    const val = args[1]

    const enumGAME = game.constructor

    /*
      phase: subtotal
      voter should be speaker
      val shouldn't be speaker

      speaker only one player
    */


    if(!game.getPlayersAlive().includes(voter))
      throw new Error(EM_VOTE)

    if(val && voter.getID() === val.getID())
      throw new Error(EM_VOTE_FOR)

    if(val ? !game.getPlayersAlive().includes(val) : false)
      throw new Error(EM_PLAYER_DEAD)


    if(game.getPhase() === enumGAME.PHASE_DAY_SUBTOTAL){
      if(!voter.isSpeak())
        throw new Error(EM_VOTE)
      if(val && val.isSpeak())
        throw new Error(EM_VOTE_FOR)
    }else if(game.getPhase() === enumGAME.PHASE_DAY_TOTAL){

    }else{
      throw new Error(EM_VOTE_PHASE)
    }

  }


  //client getters
  checkArgs_getPlayersByID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isString     = (typeof id === "string")

    return isString
  }
  check_getPlayersByID(game,...args){
    if(!this.checkArgs_getPlayersByID(...args))
      throw new Error("incorrect request Player by id")

    const id = args[0]

    if(game.players.find(player=>player.getID() === id) === undefined)
      throw new Error("this player not exist")
  }

}

module.exports = new TypeChecker()