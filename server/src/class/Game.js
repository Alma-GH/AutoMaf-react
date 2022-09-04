import Player from "./Player.js";
import {getSomeRandomInt, numPossibleVotes} from "../utils/classU.js";
import Onside from "./Onside.js";
import {
  EM_PLAYER_DEAD,
  EM_GAME_CHOOSE,
  EM_VOTE,
  EM_VOTE_FOR,
  EM_VOTE_AGAIN,
  EM_VOTE_PHASE
} from "../utils/const.js";


class Game {

  //possible ends
  static CIVIL_WIN            = "CIVIL_WIN"
  static MAFIA_WIN            = "MAFIA_WIN"

  //possible phases
  static PHASE_PREPARE        = "PHASE_PREPARE"
  static PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
  static PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
  static PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
  static PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

  //game path of phases
  static START_PATH = [
    Game.PHASE_PREPARE,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_NIGHT_MAFIA,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_SUBTOTAL,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_TOTAL
  ]

  static ADD_NEXT_DAY = [
    Game.PHASE_NIGHT_MAFIA,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_SUBTOTAL,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_TOTAL
  ]

  static ADD_NEXT_VOTE = [
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_TOTAL
  ]


  //night phases
  static NIGHT_PHASES = [
    Game.PHASE_NIGHT_MAFIA
  ]

  //(CIVIL_WIN, MAFIA_WIN)
  end

  //[Onside,Onside,...]
  players

  phasePath
  phaseIndex
  numDay

  //[CARD_MAFIA,CARD_CIVIL, null, ...]
  cards

  //player to (player,false,null) - votes for court
  tableVotes
  //[id,id,id,...]  - path of players for court
  pathIdVote

  //TODO: options
  options

  constructor(room) {
    const players = room.getPlayers()

    this.end = null
    this.players = []
    this._initPhase()
    this._initDay()
    this._createCards(players.length)

    this._initTable()
    this.pathIdVote = []
  }

  /**
   *      //* - methods that are called by requests
   **/

  getPhase(){
    return this.phasePath[this.phaseIndex]
  }
  _nextPhase(){
    const isLastPhase = (this.phaseIndex === this.phasePath.length-1)

    if(isLastPhase){
      const nobodyWin = (this.end === null)
      const repeatVote = (this.pathIdVote.length !== 1)

      if(repeatVote)
        this.phasePath = this.phasePath.concat(Game.ADD_NEXT_VOTE)
      else if(nobodyWin)
        this.phasePath = this.phasePath.concat(Game.ADD_NEXT_DAY)
    }

    //TODO: change day other way if will some night phases
    //if now phase == prepare or last night phase then next day
    if([
        Game.PHASE_PREPARE,
        Game.NIGHT_PHASES[Game.NIGHT_PHASES.length-1]
      ].includes(this.getPhase())){
      this._nextDay()
    }


    this.phaseIndex++

    //event on new phase
    if(this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      this._startSubTotal()
    else if(this.getPhase() === Game.PHASE_DAY_TOTAL)
      this._startTotal()
  }
  _initPhase(){
    this.phasePath = [...Game.START_PATH]
    this.phaseIndex = 0
  }

  getDay(){
    return this.numDay
  }
  _nextDay(){
    this.numDay +=  1
  }
  _initDay(){
    this.numDay = 0
  }

  getCards(){
    return this.cards
  }
  _createCards(numPlayers){
    //cards with mafia
    let numMaf = 1
    while(numPossibleVotes(numPlayers,numMaf)>2){
      numMaf++
    }
    const mafInds = getSomeRandomInt(numPlayers,numMaf)

    //create cards
    const cards = []
    for(let i = 1; i<numPlayers+1; i++){
      cards.push(mafInds.includes(i) ? Onside.CARD_MAFIA : Onside.CARD_CIVIL)
    }

    this.cards = cards
  }

  //create and return new created player
  createRole(player, cardIndex){
    Checker.check_createRole(this,player,cardIndex)

    const playerWithCard = new Onside(player,this.cards[cardIndex])
    this.players.push(playerWithCard)
    //clear card
    this.cards[cardIndex] = null

    return playerWithCard
  } //*

  getPlayerByID(id){
    Checker.check_getPlayersByID(this,id)

    return this.players.find(player=>player.getID() === id)
  }
  getPlayers(){
    return this.players
  }
  getPlayersAlive(){
    return this.players.filter(player=>player.isLive())
  }
  getPlayersReadiness(){
    return this.players.filter(player=>player.isReady())
  }
  getPlayersVoted(){
    return this.players.filter(player=>player.getVote() !== null)
  }
  getPlayersVotedNight(){
    return this.players.filter(player=>player.getVoteNight())
  }
  _killPlayer(victim){
    //TODO: mb add validate

    victim.kill()

    if(this._isMafiaWin())        this.end = Game.MAFIA_WIN
    else if(this._isCivilWin())   this.end = Game.CIVIL_WIN
  }

  addReadyPlayer(player){
    Checker.check_addReadyPlayer(this,player)

    player.ready()

    if(this._allPlayersReady()){
      this._nextPhase()
      this._initReadiness()
    }

  } //*
  _allPlayersReady(){
    const isPreparePhase = (this.getPhase() === Game.PHASE_PREPARE)
    return  (this.players.filter(player=>player.isReady()).length)
              ===
            (isPreparePhase ? this.getCards().length : this.getPlayersAlive().length)
  }
  _initReadiness(){
    this.players.forEach(player=>{player.unready()})
  }

  setVoteNight(player,val){
    Checker.check_setVoteNight(this,player,val)

    player.setVoteNight(val)

    if(this._allPlayersVoteNight())
      this._actionOnVotesNight()

  } //*
  _allPlayersVoteNight(){
    //TODO: rewrite (all vote for one or most)
    //who vote
    let role = Onside.CARD_MAFIA
    this._runFunctionsByPhase([
      ()=>{role = Onside.CARD_MAFIA}
    ])

    const whoVoted      = this.getPlayersVotedNight()
    const whoShouldVote = this.getPlayersAlive().filter(player=>player.getRole() === role)
    return  whoVoted.length === whoShouldVote.length
  }
  _actionOnVotesNight(){
    const choice = this._choiceVotesNight()

    this._runFunctionsByPhase([
      ()=>{this._killPlayer(choice)}
    ])

    this._initVotesNight()
    this._nextPhase()
  }
  _choiceVotesNight(){
    if(this._allPlayersVoteNight())
      return this.getPlayersVotedNight()[0].getVoteNight()
    return null
  }
  _initVotesNight(){
    this.getPlayers()
      .filter(player=>player.getRole()!==Onside.CARD_CIVIL)
      .forEach(player=>player.setVoteNight(null))
  }


  _startSubTotal(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_SUBTOTAL) return

    const first = this.getPlayersAlive()[0]
    first.speakOn()
  }
  _nextSpeaker(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_SUBTOTAL) return
    //TODO: check speakerInd != -1

    const alive       = this.getPlayersAlive()
    const speakerInd  = alive.findIndex(player=>player.isSpeak())
    const next        = alive[speakerInd+1]

    alive[speakerInd].speakOff()


    if(next)
      next.speakOn()
  }
  _startTotal(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_TOTAL) return

    this._initTable()

    const first = this.getPlayerByID(this.pathIdVote[0])
    first.judgedOn()
  }
  nextJudged(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_TOTAL) return
    //TODO: check judgedInd != -1

    const path        = this.pathIdVote
    const judgedInd   = path.findIndex(id=>this.getPlayerByID(id).isJudged())
    const nextID      = path[judgedInd+1]
    const next        = nextID!==undefined ? this.getPlayerByID(nextID) : null

    const judgedPl    = this.getPlayerByID(path[judgedInd])
    judgedPl.judgedOff()

    //TODO: mb auto vote
    if(next)
      next.judgedOn()
    else{
      const unvotes = this.getPlayersAlive()
        .filter(player=>player.getVote()===null)
      // unvotes.forEach(player=>{
      //   if(player!==judgedPl)
      //     this.setVote(player,judgedPl)
      // })
      if(unvotes.length)
        this.getPlayerByID(path[0]).judgedOn()
    }

    // if(judgedPl.getVote()===null &&  !next)
    //   this.setVote(judgedPl, false)
  }

  setVote(player,val){
    Checker.check_setVote(this,player,val)

    player.setVote(val)
    this.tableVotes.set(player,val)
    this._nextSpeaker()
    //nextJudged by timer

    //TODO: check pathID
    if(this._allPlayersVote())
      this._actionOnVotes()
  } //*
  _allPlayersVote(){
    const whoVoted      = this.getPlayersVoted()
    const whoShouldVote = this.getPlayersAlive()
    return  whoVoted.length === whoShouldVote.length
  }
  _actionOnVotes(){
    //todo: clear table votes

    const isSubTotal = (this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
    this._createPathIdFromTable(isSubTotal)

    //decision is made
    if((this.pathIdVote.length === 1) && (this.getPhase() === Game.PHASE_DAY_TOTAL)){
      const suspectID = this.pathIdVote[0]
      const suspect   = this.getPlayerByID(suspectID)
      this._killPlayer(suspect)

      this._initTable()
    }

    //clear
    this.players.forEach(player=>{
      player.judgedOff();
      player.speakOff()
    })

    this._initVotes()
    this._nextPhase()
  }
  _initVotes(){
    this.getPlayers()
      .forEach(player=>player.setVote(null))
  }


  getTable(){
    return this.tableVotes
  }
  getPathId(){
    return this.pathIdVote
  }
  _createPathIdFromTable(firstTotal){

    //init map
    const map = new Map()
    const aliveIDs = this.getPlayersAlive().map(player=>player.getID())
    for(let id of aliveIDs){
      map.set(id,0)
    }

    //score
    const voteIDs = Array.from(this.tableVotes.values())
      .filter(isPl=>![false,null].includes(isPl))
      .map(player=>player.getID())
    for(let id of voteIDs){
      map.set(id,map.get(id) + 1)
    }

    //result
    let sortEntryByScore = Array.from(map.entries())
      .sort((a,b)=>a[1]-b[1])

    if(!firstTotal){
      const scores = sortEntryByScore.map(entry=>entry[1])
      const maxScore = Math.max(...scores)
      sortEntryByScore = sortEntryByScore
        .filter(entry=>entry[1] === maxScore)
    }

    this.pathIdVote = sortEntryByScore
      .map(entry=>entry[0])
  }
  _initTable(){
    this.tableVotes = new Map()
  }

  _isMafiaWin(){
    const alive     = this.getPlayersAlive()
    const aliveNum  = alive.length

    const mafia     = alive.filter(player=>player.getRole() === Onside.CARD_MAFIA)
    const mafiaNum  = mafia.length

    return mafiaNum*2 >= aliveNum
  }
  _isCivilWin(){
    const alive     = this.getPlayersAlive()
    const mafia     = alive.filter(player=>player.getRole() === Onside.CARD_MAFIA)
    const mafiaNum  = mafia.length

    return mafiaNum === 0
  }

  //call only on night phases
  _runFunctionsByPhase(functions){
    const map = {
      [Game.PHASE_NIGHT_MAFIA]:functions[0],
      //TODO: add other night phases
    }

    const isNightPhase = (typeof map[this.getPhase()] === "function")

    if(isNightPhase)  map[this.getPhase()]()
    else              throw new Error("Access error: other phase in Game")
  }



  toString(){
    return JSON.stringify({
      path:this.phasePath,
      index:this.phaseIndex,
      phase:this.getPhase(),
      numDay:this.getDay(),

      cards:this.getCards(),

      players:this.getPlayers(),
      table:Array.from(this.getTable().entries())
        .map(row=>[row[0].getName(),row[1] ? row[1].getName():row[1]]),
      pathID:this.getPathId(),

      alive:this.getPlayersAlive().map(player=>player.getName()),
      readiness:this.getPlayersReadiness().map(player=>player.getName()),
      voters:this.getPlayersVoted().map(player=>player.getName()),

      end: this.end
    }, null, 2)
  }

}


export default Game


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
      throw new Error("this card has already been taken")
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
      throw new Error("this player already ready")

    if(!game.getPlayersAlive().includes(player))
      throw new Error("this player not alive")

    if(![Game.PHASE_DAY_DISCUSSION,Game.PHASE_PREPARE].includes(game.getPhase()))
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

    let voters = null
    game._runFunctionsByPhase([
      ()=>{voters = game.getPlayers().filter(player=>player.getRole() === Onside.CARD_MAFIA)}
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

    if(voters.includes(val))
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

    /*
      phase: subtotal
      voter should be speaker
      val shouldn't be speaker

      phase: total
      voter shouldn't be judged
      val should be judged

      speaker and judged only one player
    */


    if(!game.getPlayersAlive().includes(voter))
      throw new Error(EM_VOTE)

    if(val ? !game.getPlayersAlive().includes(val) : false)
      throw new Error(EM_PLAYER_DEAD)

    if(voter.getVote() !== null)
      throw new Error(EM_VOTE_AGAIN)


    if(game.getPhase() === Game.PHASE_DAY_SUBTOTAL){
      if(!voter.isSpeak())
        throw new Error(EM_VOTE)
      if(val && val.isSpeak())
        throw new Error(EM_VOTE_FOR)
    }else if(game.getPhase() === Game.PHASE_DAY_TOTAL){
      if(voter.isJudged())
        throw new Error(EM_VOTE)
      if(val && !val.isJudged())
        throw new Error(EM_VOTE_FOR)
    }else{
      throw new Error(EM_VOTE_PHASE)
    }

  }


  //client getters
  checkArgs_getPlayersByID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isInt     = Number.isInteger(id)

    return isInt
  }
  check_getPlayersByID(game,...args){
    if(!this.checkArgs_getPlayersByID(...args))
      throw new Error("incorrect request Player by id")

    const id = args[0]

    if(game.players.find(player=>player.getID() === id) === undefined)
      throw new Error("this player not exist")
  }

}

const Checker = new TypeChecker()

/*
class TypeCheckerOld{

  static PREFIX_TYPE      = "Type arg-s error"
  static PREFIX_INVALID   = "Invalid data error"

  static NAME_CLS = "Game"
  game

  constructor(game) {
    this.game = game
  }

  _getErrorArg(functionName){
    return new Error(`${TypeCheckerOld.PREFIX_TYPE}: .${functionName}() in ${TypeCheckerOld.NAME_CLS}`)
  }
  _getError(functionName, description){
    return new Error(`${TypeCheckerOld.PREFIX_INVALID}: .${functionName}() in ${TypeCheckerOld.NAME_CLS} - ${description}`)
  }

  //client setters
  checkArgs_createRole(...args){
    if(args.length!==2) return false

    const player = args[0]
    const cardIndex = args[1]

    const isPlayer  = (player instanceof Player) && !(player instanceof Onside)

    const isNum     = typeof cardIndex === "number"
    const isInt     = Number.isInteger(cardIndex)
    const isInd     = (cardIndex >= 0) && (cardIndex < this.game.cards.length)

    return (isPlayer && isNum && isInt && isInd)
  }
  check_createRole(...args){
    const nameF = this.game.createRole.name

    if(!this.checkArgs_createRole(...args))
      throw this._getErrorArg(nameF)

    const player = args[0]
    const cardIndex = args[1]

    if(this.game.players.some(onside=>onside.getID()===player.getID()))
      throw this._getError(nameF, "this player has already drawn a card")

    if(this.game.getCards()[cardIndex] === null)
      throw this._getError(nameF, "this card has already been taken")
  }

  checkArgs_addReadyPlayer(...args){
    if(args.length!==1) return false

    const player = args[0]

    const isOnside  = (player instanceof Onside)

    return isOnside
  }
  check_addReadyPlayer(...args){
    const nameF = this.game.addReadyPlayer.name

    if(!this.checkArgs_addReadyPlayer(...args))
      throw this._getErrorArg(nameF)

    const player = args[0]

    if(this.game.getPlayersReadiness().includes(player))
      throw this._getError(nameF, "this player already ready")

    if(!this.game.getPlayersAlive().includes(player))
      throw this._getError(nameF, "this player not alive")

    if(![Game.PHASE_DAY_DISCUSSION,Game.PHASE_PREPARE].includes(this.game.getPhase()))
      throw this._getError(nameF,"not allowed in this phase.")
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
  check_setVoteNight(...args){
    const nameF = this.game.setVoteNight.name

    if(!this.checkArgs_setVoteNight(...args))
      throw this._getErrorArg(nameF)

    const voter = args[0]
    const val = args[1]

    let voters = null
    this.game._runFunctionsByPhase([
      ()=>{voters = this.game.getPlayers().filter(player=>player.getRole() === Onside.CARD_MAFIA)}
    ])


    if(voters === null)
      throw this._getError(nameF, "not allowed in this phase")

    if(
      !this.game.getPlayersAlive().includes(voter) ||
      (val ? !this.game.getPlayersAlive().includes(val) : false)
    )
      throw this._getError(nameF, "val and voter must not be dead")

    if(!voters.includes(voter))
      throw this._getError(nameF, "voter should have role corresponding to phase")

    if(voters.includes(val))
      throw this._getError(nameF, "val not includes in voters")
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
  check_setVote(...args){
    const nameF = this.game.setVote.name

    if(!this.checkArgs_setVote(...args))
      throw this._getErrorArg(nameF)

    const voter = args[0]
    const val = args[1]

    //phase: subtotal
    //voter should be speaker
    //val shouldn't be speaker

    //phase: total
    //voter shouldn't be judged
    //val should be judged


    if(
      !this.game.getPlayersAlive().includes(voter) ||
      (val ? !this.game.getPlayersAlive().includes(val) : false)
    )
      throw this._getError(nameF, "val and voter must not be dead")

    //implemented with .nextVoter() for subTotal
    if(voter.getVote() !== null)
      throw this._getError(nameF, "voter can vote one time on phase ")

    if(this.game.getPhase() === Game.PHASE_DAY_SUBTOTAL){
      if(!voter.isSpeak())
        throw this._getError(nameF, "voter must be speaker")
      if(val && val.isSpeak())
        throw this._getError(nameF, "val mustn't be speaker")
    }else if(this.game.getPhase() === Game.PHASE_DAY_TOTAL){
      if(voter.isJudged())
        throw this._getError(nameF, "voter mustn't be judged")
      if(val && !val.isJudged())
        throw this._getError(nameF, "val must be judged")
    }else{
      throw this._getError(nameF, "not allowed in this phase")
    }

  }



  //class methods
  checkArgs_getPlayersByID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isInt     = Number.isInteger(id)

    return isInt
  }
  check_getPlayersByID(...args){
    //TODO: change error messages
    if(!this.checkArgs_getPlayersByID(...args))
      throw new Error("Type error: getPlayersByID in Game")

    const id = args[0]

    if(this.game.players.find(player=>player.getID() === id) === undefined)
      throw new Error("Type error: getPlayersByID in Game")
  }

}
*/










