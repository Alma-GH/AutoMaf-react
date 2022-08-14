import Player from "./Player.js";
import {getSomeRandomInt, numPossibleVotes} from "./utils/classU.js";

const MIN_PLAYERS = 4
const CARD_MAFIA = "CARD_MAFIA"
const CARD_CIVIL = "CARD_CIVIL"

class Game {

  //possible phases
  static PHASE_PREPARE        = "PHASE_PREPARE"
  static PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
  static PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
  static PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
  static PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

  //night phases
  static NIGHT_PHASES = [
    Game.PHASE_NIGHT_MAFIA
  ]

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

  //special cards
  static SPEC_CARDS = [CARD_MAFIA]




  phasePath
  phaseIndex
  numDay

  //[Player, Player, ...]
  livePlayers
  //[Player, Player, ...]
  readiness

  //[CARD_MAFIA,CARD_CIVIL, ...]
  cards

  //player to cardInd
  mapping
  //player to (player,false,null) - votes for court
  votes
  //player to (player,null) - votes for special role (mafia, doctor, commissar)
  votesNight

  //TODO: options
  options

  constructor(players) {
    this._initPhase()
    this._initDay()
    this._setPlayers(players)

    this._initReadiness()

    this._createCards(this.livePlayers.length)

    this._initMapping()
    this._initVotes()
  }

  getPhase(){
    return this.phasePath[this.phaseIndex]
  }
  // setPhase(phase){
  //   if(!([
  //     Game.PHASE_PREPARE,
  //     Game.PHASE_DAY_DISCUSSION,
  //     Game.PHASE_NIGHT_MAFIA,
  //     Game.PHASE_DAY_SUBTOTAL,
  //     Game.PHASE_DAY_TOTAL
  //   ].includes(phase))) return false
  //
  //   // this.phase = phase
  // }
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
    if(this.getPhase() === Game.PHASE_NIGHT_MAFIA || this.numDay === 0){
      this._initVotesNight(CARD_MAFIA)
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

  getPlayers(){
    return this.livePlayers
  }
  _setPlayers(players){
    const isArr         = Array.isArray(players)
    const havePlayers   = isArr ? players.every(player=>(player instanceof Player)) : false
    const enoughPlayers = isArr ? players.length >= MIN_PLAYERS  : false

    if(isArr && havePlayers && enoughPlayers)   this.livePlayers = [...players]
    else                                        throw new Error("Type error: players in Game")
  }
  _killPlayer(victim){

    if(victim instanceof Player)
      //TODO: mb add clear all votes
      this.livePlayers = this.livePlayers.filter(player=>player.getID()!==victim.getID())
    else
      throw new Error("Type error: victim in Game")

    //TODO check on win

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

  getReadiness(){
    return this.readiness
  }
  _allPlayersReady(){
    return this.readiness.length === this.livePlayers.length
  }
  addReadyPlayer(player){
    if(player instanceof Player && !this.getReadiness().includes(player))
      this.readiness.push(player)
    else
      throw new Error("Type error: ready player in Game")

    if(this._allPlayersReady()){
      this._nextPhase()
      this._initReadiness()
    }

  } //*
  _initReadiness(){
    this.readiness = []
  }

  getMapping(){
    return this.mapping
  }
  addMapping(player,cardIndex){
    //validate conditions
    const isPlayer  = player instanceof Player
    const isNotSetted = isPlayer ? this.mapping.get(player)===null : false

    const isNum     = typeof cardIndex === "number"
    const isInt     = Number.isInteger(cardIndex)
    const isInd     = (cardIndex >= 0) && (cardIndex < this.cards.length)

    //result
    if(isPlayer && isNum && isInt && isInd && isNotSetted && this.mapping.has(player))
      this.mapping.set(player,cardIndex)
    else
      throw new Error("Type error: mapping in Game")
  } //*
  _initMapping(){
    this.mapping = new Map()
    for(let player of this.livePlayers){
      this.mapping.set(player,null)
    }
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


  toString(){
    return JSON.stringify({
      phase:this.getPhase(),
      phasePath:this.phasePath,
      numDay:this.getDay(),
      livePlayers:this.getPlayers(),
      cards:this.getCards(),
      readiness:this.getReadiness(),
      votes:Array.from(this.votes.entries()),
      mapping:Array.from(this.mapping.entries()),
      votesNight:Array.from(this.votesNight.entries())
    }, null, 2)
  }

}


export default Game