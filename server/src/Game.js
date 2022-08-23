import Player from "./Player.js";
import {getSomeRandomInt, numPossibleVotes} from "./utils/classU.js";
import Onside from "./Onside.js";

const MIN_PLAYERS = 4

class Game {

  Checker = new TypeChecker(this)
  // Room

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
      //TODO
      //temp
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

    //validate
    if(numPlayers<MIN_PLAYERS) numPlayers = MIN_PLAYERS

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
    this.Checker.check_createRole(player,cardIndex)

    const playerWithCard = new Onside(player,this.cards[cardIndex])
    this.players.push(playerWithCard)
    //clear card
    this.cards[cardIndex] = null

    return playerWithCard
  } //*

  getPlayerByID(id){
    this.Checker.check_getPlayersByID(id)
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
    this.Checker.check_addReadyPlayer(player)

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
    this.Checker.check_setVoteNight(player,val)

    player.setVoteNight(val)

    if(this._allPlayersVoteNight())
      this._actionOnVotesNight()

  } //*
  _allPlayersVoteNight(){

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


    this.getPlayerByID(path[judgedInd]).judgedOff()


    if(next)
      next.judgedOn()
  }   //*

  setVote(player,val){
    this.Checker.check_setVote(player,val)

    player.setVote(val)
    this.tableVotes.set(player,val)
    this._nextSpeaker()
    //TODO: nextJudged by timer

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

  static PREFIX_TYPE      = "Type arg-s error"
  static PREFIX_INVALID   = "Invalid data error"

  static NAME_CLS = "Game"
  game

  constructor(game) {
    this.game = game
  }

  _getErrorArg(functionName){
    return new Error(`${TypeChecker.PREFIX_TYPE}: .${functionName}() in ${TypeChecker.NAME_CLS}`)
  }
  _getError(functionName, description){
    return new Error(`${TypeChecker.PREFIX_INVALID}: .${functionName}() in ${TypeChecker.NAME_CLS} - ${description}`)
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
    const nameF = this.check_createRole.name

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
    //TODO: change error messages
    if(!this.checkArgs_addReadyPlayer(...args))
      throw new Error("Type error: addReadyPlayer in Game")

    const player = args[0]

    if(this.game.getPlayersReadiness().includes(player))
      throw new Error("Type error: addReadyPlayer in Game")

    if(!this.game.getPlayersAlive().includes(player))
      throw new Error("Type error: addReadyPlayer in Game")

    if(![Game.PHASE_DAY_DISCUSSION,Game.PHASE_PREPARE].includes(this.game.getPhase()))
      throw new Error("Type error: addReadyPlayer in Game")
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
    //TODO: change error messages
    if(!this.checkArgs_setVoteNight(...args))
      throw new Error("Type error: voteNight in Game")

    const voter = args[0]
    const val = args[1]

    let voters = []
    this.game._runFunctionsByPhase([
      ()=>{voters = this.game.getPlayers().filter(player=>player.getRole() === Onside.CARD_MAFIA)}
    ])

    //voter should have role corresponding to phase
    if(!voters.includes(voter))
      throw new Error("Type error: voteNight in Game")
    //val not includes in voters
    if(voters.includes(val))
      throw new Error("Type error: voteNight in Game")

    //TODO: mb add check on val and voter is not dead
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
    //TODO: change error messages
    if(!this.checkArgs_setVote(...args))
      throw new Error("Type error: setVote in Game")

    const voter = args[0]
    const val = args[1]

    //phase: subtotal
    //voter should be speaker
    //val shouldn't be speaker

    //phase: total
    //voter shouldn't be judged
    //val should be judged

    //voter can vote one time on phase -> implemented with .nextVoter() for subTotal
    if(voter.getVote() !== null)
      throw new Error("Type error: setVote in Game")

    if(this.game.getPhase() === Game.PHASE_DAY_SUBTOTAL){
      if(!voter.isSpeak())
        throw new Error("Type error: setVote in Game")
      if(val && val.isSpeak())
        throw new Error("Type error: setVote in Game")
    }else if(this.game.getPhase() === Game.PHASE_DAY_TOTAL){
      if(voter.isJudged())
        throw new Error("Type error: setVote in Game")
      if(val && !val.isJudged())
        throw new Error("Type error: setVote in Game")
    }else{
      throw new Error("Type error: setVote in Game")
    }

    //TODO: mb add check on val and voter is not dead
  }



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











