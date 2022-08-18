import Player from "./Player.js";
import {getSomeRandomInt, numPossibleVotes} from "./utils/classU.js";
import Onside from "./Onside.js";

const MIN_PLAYERS = 4
const CARD_MAFIA = Onside.CARD_MAFIA
const CARD_CIVIL = Onside.CARD_CIVIL

class Game {

  Checker = new TypeChecker(this)
  // Room

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

    this.players = []
    this._initPhase()
    this._initDay()
    this._createCards(players.length)

    this._initTable()
    this.pathIdVote = []
  }

  getPhase(){
    return this.phasePath[this.phaseIndex]
  }
  _nextPhase(){
    //TODO
    //temp
    const nobodyWin = false
    const repeatVote = false

    const isLastPhase = (this.phaseIndex === this.phasePath.length-1)

    if(isLastPhase){
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
      cards.push(mafInds.includes(i) ? CARD_MAFIA : CARD_CIVIL)
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
    //TODO: mb add clear all votes(for court)

    victim.kill()

    //TODO check on win
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
    //TODO: check only alive players
    const isPreparePhase = (this.getPhase() === Game.PHASE_PREPARE)
    return  (this.players.filter(player=>player.isReady()).length)
              ===
            (isPreparePhase ? this.getCards().length : this.players.length)
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
    //TODO: check only alive players

    //who vote
    let role = Onside.CARD_MAFIA
    this._runFunctionsByPhase([
      ()=>{role = Onside.CARD_MAFIA}
    ])

    const whoVoted      = this.getPlayersVotedNight()
    const whoShouldVote = this.players.filter(player=>player.getRole() === role)
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



  startSubTotal(){
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
  startTotal(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_TOTAL) return

    //TODO: CONTINUE (add createPathId)
    this._initTable()

    const first = this.getPlayersAlive()[0]
    first.judgedOn()
  }
  _nextJudged(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_TOTAL) return
    //TODO: check judgedInd != -1

    const alive       = this.getPlayersAlive()
    const judgedInd   = alive.findIndex(player=>player.isJudged())
    const next        = alive[judgedInd+1]

    alive[judgedInd].judgedOff()


    if(next)
      next.judgedOn()
  }

  setVote(player,val){
    this.Checker.check_setVote(player,val)

    player.setVote(val)
    this.tableVotes.set(player,val)
    this._nextSpeaker()
    //TODO: nextJudged by timer

    if(this._allPlayersVote())
      this._actionOnVotes()
  } //*
  _allPlayersVote(){
    const whoVoted      = this.getPlayersVoted()
    const whoShouldVote = this.getPlayersAlive()
    return  whoVoted.length === whoShouldVote.length
  }
  _actionOnVotes(){
    //TODO: if phase total -> kill
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
  _createPathIdFromTable(isSubTotal){

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

    if(!isSubTotal){
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
      table:Array.from(this.tableVotes.entries())
        .map(row=>[row[0].getName(),row[1] ? row[1].getName():row[1]]),

      alive:this.getPlayersAlive().map(player=>player.getName()),
      readiness:this.getPlayersReadiness().map(player=>player.getName()),
      voters:this.getPlayersVoted().map(player=>player.getName()),
    }, null, 2)
  }

}


export default Game




//TODO: TypeChecker for game
class TypeChecker{

  game

  constructor(game) {
    this.game = game
  }

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
    //TODO: change error messages
    if(!this.checkArgs_createRole(...args))
      throw new Error("Type error: createRole in Game")

    const player = args[0]
    const cardIndex = args[1]

    if(this.game.players.some(onside=>onside.getID()===player.getID()))
      throw new Error("Type error: createRole in Game")

    if(this.game.getCards()[cardIndex] === null)
      throw new Error("Type error: createRole in Game")
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

    //TODO: check on phase discussion(or prepare) + check on alive(mb set readiness all dead player)
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

    //voter can vote one time on phase -> implemented with .nextVoter()


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

}











