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


  phase
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
    this.phase = Game.PHASE_PREPARE
    this.initDay()
    this.setPlayers(players)
    this.createCards(this.livePlayers.length)
    this.initReadiness()
    this.initVotes()


    this.mapping = new Map()
  }

  getPhase(){
    return this.phase
  }
  setPhase(phase){
    if(!([
      Game.PHASE_PREPARE,
      Game.PHASE_DAY_DISCUSSION,
      Game.PHASE_NIGHT_MAFIA,
      Game.PHASE_DAY_SUBTOTAL,
      Game.PHASE_DAY_TOTAL
    ].includes(phase))) return false

    this.phase = phase
  }

  getDay(){
    return this.numDay
  }
  nextDay(){
    this.numDay +=  1
  }
  initDay(){
    this.numDay = 0
  }

  getPlayers(){
    return this.livePlayers
  }
  setPlayers(players){
    const isArr         = Array.isArray(players)
    const havePlayers   = isArr ? players.every(player=>(player instanceof Player)) : false
    const enoughPlayers = isArr ? players.length >= MIN_PLAYERS  : false

    if(isArr && havePlayers && enoughPlayers)   this.livePlayers = [...players]
    else                                        throw new Error("Type error: players in Game")
  }
  killPlayer(player){
    //TODO
  }

  getCards(){
    return this.cards
  }
  createCards(numPlayers){

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

    return cards
  }

  getReadiness(){
    return this.readiness
  }
  addReadyPlayer(player){
    if(player instanceof Player)
      this.readiness.push(player)
  }
  initReadiness(){
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
  }
  initVotes(){
    this.votes = new Map()
    for(let player of this.livePlayers){
      this.votes.set(player,null)
    }
  }


  toString(){
    return JSON.stringify({
      phase:this.phase,
      numDay:this.numDay,
      livePlayers:this.livePlayers,
      cards:this.cards,
      readiness:this.readiness,
      votes:this.votes
    }, null, 2)
  }

}


export default Game