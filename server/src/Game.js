import Player from "./Player.js";
import {getSomeRandomInt, numPossibleVotes} from "./utils/classU.js";

const MIN_PLAYERS = 4
const CARD_MAFIA = "CARD_MAFIA"
const CARD_CIVIL = "CARD_CIVIL"

class Game {

  static PHASE_PREPARE        = "PHASE_PREPARE"
  static PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
  static PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
  static PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
  static PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

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


  phasePath
  phaseIndex
  numDay
  //[Player, Player, ...]
  livePlayers
  //[CARD_MAFIA,CARD_CIVIL, ...]
  cards
  //TODO: player to card
  mapping
  //[Player, Player, ...]
  readiness
  //player to (player,false,null)
  votes

  //TODO: options
  options

  constructor(players) {
    this._initPhase()
    this._initDay()
    this._setPlayers(players)
    this._createCards(this.livePlayers.length)
    this._initReadiness()
    this._initVotes()
    this._initMapping()
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
    if(this.getPhase() === Game.PHASE_NIGHT_MAFIA || this.numDay === 0)
      this._nextDay()

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
  killPlayer(victim){

    if(victim instanceof Player)
      this.livePlayers = this.livePlayers.filter(player=>player.getID()!==victim.getID())
    else
      throw new Error("Type error: victim in Game")

    //TODO check on win

  } //*

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
    if(isPlayer && isNum && isInt && isInd && isNotSetted)
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


  getVotes(){
    return this.votes
  }
  setVote(player,val){
    const valIsNull   = [false,null].includes(val)
    const valIsPlayer = val instanceof Player
    const keyIsPlayer = player instanceof Player

    if( (valIsPlayer || valIsNull) && keyIsPlayer)
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


  toString(){
    return JSON.stringify({
      phase:this.phasePath[this.phaseIndex],
      phasePath:this.phasePath,
      numDay:this.numDay,
      livePlayers:this.livePlayers,
      cards:this.cards,
      readiness:this.readiness,
      votes:Array.from(this.votes.entries()),
      mapping:Array.from(this.mapping.entries())
    }, null, 2)
  }

}


export default Game