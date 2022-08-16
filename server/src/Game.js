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
  //special cards
  static SPEC_CARDS = [CARD_MAFIA]

  //[Onside,Onside,...]
  players = []

  phasePath
  phaseIndex
  numDay

  //[Player, Player, ...]
  livePlayers

  //[CARD_MAFIA,CARD_CIVIL, null, ...]
  cards

  //player to cardInd
  mapping
  //player to (player,false,null) - votes for court
  votes
  //player to (player,null) - votes for special role (mafia, doctor, commissar)
  votesNight

  //TODO: options
  options

  constructor(room) {
    const players = room.getPlayers()

    this._initPhase()
    this._initDay()
    this._createCards(players.length)

    this._initReadiness()
    // this._initVotes()
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
      // this._initVotesNight(CARD_MAFIA)
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
  getPlayersReadiness(){
    return this.players.filter(player=>player.isReady())
  }
  getPlayersAlive(){
    return this.players.filter(player=>player.isLive())
  }
  //TODO: fix
  _killPlayer(victim){

    if(victim instanceof Player)
      //TODO: mb add clear all votes
      this.livePlayers = this.livePlayers.filter(player=>player.getID()!==victim.getID())
    else
      throw new Error("Type error: victim in Game")

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






  getVotes(){
    return this.votes
  }
  setVote(player,val){
    const valIsNull   = [false,null].includes(val)
    const valIsPlayer = val instanceof Player
    const keyIsPlayer = player instanceof Player

    if( (valIsPlayer || valIsNull) && keyIsPlayer && this.votes.has(player))
      this.votes.set(player,val)
    else
      throw new Error("Type error: vote in Game")

    //TODO: if(all players vote) do something -> clear votes

  } //*
  _initVotes(){
    this.votes = new Map()
    for(let player of this.livePlayers){
      this.votes.set(player,null)
    }
  }

  getVotesNight(){
    return this.votesNight
  }
  _choiceVotesNight(){
    if(this._allPlayersVoteNight())
      return Array.from(this.getVotesNight().values())[0]
    return null
  }
  _allPlayersVoteNight(){
    const votes = Array.from(this.votesNight.values())
    return votes.every(vote=>vote!==null) && votes.every(vote=>vote===votes[0])
  }
  _actionOnVotesNight(){
    const choice = this._choiceVotesNight()

    switch (this.getPhase()){
      case Game.PHASE_NIGHT_MAFIA:
        this._killPlayer(choice)
        this._initVotesNight(CARD_MAFIA)
        break
      //add other night phases
    }

    this._nextPhase()

  }
  setVoteNight(player,val){
    const valIsNull   = (val === null)
    const valIsPlayer = (val instanceof Player)
    const keyIsPlayer = (player instanceof Player)
    const isNightPhase= (Game.NIGHT_PHASES.includes(this.getPhase()))

    if( (valIsPlayer || valIsNull) && keyIsPlayer && isNightPhase && this.votesNight.has(player))
      this.votesNight.set(player,val)
    else
      throw new Error("Type error: voteNight in Game")


    if(this._allPlayersVoteNight())
      this._actionOnVotesNight()

  } //*
  _initVotesNight(card){

    if(!Game.SPEC_CARDS.includes(card)) throw new Error("Type error: card in Game")

    this.votesNight = new Map()

    for(let player of this.livePlayers){
      const cardIndex = this.mapping.get(player)
      const haveSpecCard = (this.cards[cardIndex] === card)

      if(haveSpecCard) this.votesNight.set(player,null)
    }
  }



  _runFunctionsByPhase(functions){
    const map = {
      [Game.PHASE_NIGHT_MAFIA]:functions[0],
      //TODO: add other night phases
    }
    map[this.getPhase()]()
  }



  toString(){
    return JSON.stringify({
      phase:this.getPhase(),
      phasePath:this.phasePath,
      numDay:this.getDay(),
      cards:this.getCards(),
      readiness:this.getPlayersReadiness(),
      // votes:Array.from(this.votes.entries()),
      // mapping:Array.from(this.mapping.entries()),
      // votesNight:Array.from(this.votesNight.entries())


      players:this.getPlayers()
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
      throw new Error("Type error: addMapping in Game")

    const player = args[0]
    const cardIndex = args[1]

    if(this.game.players.some(onside=>onside.getID()===player.getID()))
      throw new Error("Type error: addMapping in Game")

    if(this.game.getCards()[cardIndex] === null)
      throw new Error("Type error: addMapping in Game")
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



  checkArgs_voteNight(...args){
    if(args.length!==2) return false

    const player  = args[0]
    const val     = args[1]

    const valIsNull   = (val === null)
    const valIsPlayer = (val instanceof Onside)
    const keyIsPlayer = (player instanceof Onside)

    return (valIsPlayer || valIsNull) && keyIsPlayer
  }
  check_voteNight(...args){
    //TODO: change error messages
    if(!this.checkArgs_voteNight(...args))
      throw new Error("Type error: voteNight in Game")

    const voter = args[0]
    const val = args[1]

    //TODO: CONTINUE
    let voters
    this.game._runFunctionsByPhase([
      ()=>{voters = this.game.getPlayers().filter(player=>player.getRole() === Onside.CARD_MAFIA)}
    ])
    //val not includes in voters
    //voter should have role corresponding to phase


  }

}











