const {getSomeRandomInt, numPossibleVotes} = require("../utils/classU.js");
const Onside = require("./Onside.js");
const Checker = require("./TypeCheckers/TCGame.js")



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

  log

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

    this.log = room.getLog()
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
    const phaseNow = this.getPhase()
    const l = this.log

    if(phaseNow)
      l.setLog(l.constructor.WHO_LOG, l.getLogPhraseByPhase(this.getPhase()))

    //event on new phase
    if(phaseNow === Game.PHASE_DAY_SUBTOTAL)
      this._startSubTotal()
    else if(phaseNow === Game.PHASE_DAY_TOTAL)
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
  getPlayerSpeaker(){
    return this.getPlayers().find(player=>player.isSpeak())
  }
  getPlayerJudged(){
    return this.getPlayers().find(player=>player.isJudged())
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
    const l = this.log
    l.setLog(l.constructor.WHO_LOG, l.getLogPhraseByDeadPlayer(victim))

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
    //who vote
    let role = Onside.CARD_MAFIA
    this._runFunctionsByPhase([
      ()=>{role = Onside.CARD_MAFIA}
    ])

    const whoVoted      = this.getPlayersVotedNight()
    const whoShouldVote = this.getPlayersAlive().filter(player=>player.getRole() === role)
    const votes         = whoVoted.map(player=>player.getVoteNight())
    return  ((whoVoted.length === whoShouldVote.length)
      && votes.every(vote=>vote===votes[0]))
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
    if(this._isEndVote()){
      const isSubTotal = (this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      this._createPathIdFromTable(isSubTotal)
      this._actionOnVotes()
    }

  } //*
  _allPlayersVote(){
    const whoVoted      = this.getPlayersVoted()
    const whoShouldVote = this.getPlayersAlive()
    return  whoVoted.length === whoShouldVote.length
  }
  _enoughVote(){
    const whoVoted      = this.getPlayersVoted()
    const whoShouldVote = this.getPlayersAlive()

    if(whoVoted.length === whoShouldVote.length)
      return true

    const sortEntry     = this.getSortVotesByScore()
    const len = sortEntry.length
    const max1 = sortEntry[len-1][1]
    const max2 = sortEntry[len-2][1]
    const whoUnVoted = whoShouldVote.length - whoVoted.length

    return  max1>max2+whoUnVoted
  }
  _isEndVote(){
    if(this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      return this._allPlayersVote()
    else if(this.getPhase() === Game.PHASE_DAY_TOTAL)
      return this._enoughVote()
  }
  _actionOnVotes(){
    //todo: clear table votes

    //decision is made
    let choice = this._choiceVotes()
    if(choice){
      this._killPlayer(choice)
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
  _choiceVotes(){
    if((this.pathIdVote.length === 1) && (this.getPhase() === Game.PHASE_DAY_TOTAL)){
      const suspectID = this.pathIdVote[0]
      return this.getPlayerByID(suspectID)
    }

    return null
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
  getSortVotesByScore(){
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
    return Array.from(map.entries())
      .sort((a,b)=>a[1]-b[1])
  }
  _createPathIdFromTable(firstTotal){

    let sortEntryByScore = this.getSortVotesByScore()

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

  //separation for timer
  addReadyPlayerWithoutNextPhase(player){
    Checker.check_addReadyPlayer(this,player)

    player.ready()
  } //*
  nextPhaseByReadyPlayers(){
    if(this._allPlayersReady()){
      this._nextPhase()
      this._initReadiness()
    }
  }
  setVoteNightWithoutNextPhase(player,val){
    Checker.check_setVoteNight(this,player,val)

    player.setVoteNight(val)
  } //*
  nextPhaseByNightVote(){
    if(this._allPlayersVoteNight())
      this._actionOnVotesNight()
  }
  setVoteWithoutNextPhase(player,val){
    Checker.check_setVote(this,player,val)

    player.setVote(val)
    this.tableVotes.set(player,val)
    this._nextSpeaker()
    //nextJudged by timer

    if(this._isEndVote()){
      const isSubTotal = (this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      this._createPathIdFromTable(isSubTotal)
    }

  } //*
  nextPhaseByVote(){
    if(this._isEndVote())
      this._actionOnVotes()
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
  voteInfo(){
    return {
      table:Array.from(this.getTable().entries())
        .map(row=>[row[0].getName(),row[1] ? row[1].getName():row[1]]),
      pathID:this.getPathId(),
      voters:this.getPlayersVoted().map(player=>player.getName()),
    }
  }

}


module.exports = Game












