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
  static PHASE_NIGHT_DETECTIVE  = "PHASE_NIGHT_DETECTIVE"
  static PHASE_NIGHT_DOCTOR   = "PHASE_NIGHT_DOCTOR"
  static PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
  static PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

  //night phases
  static NIGHT_PHASES = [
    Game.PHASE_NIGHT_MAFIA,
    Game.PHASE_NIGHT_DETECTIVE,
    Game.PHASE_NIGHT_DOCTOR,
  ]

  //game path of phases
  static START_PATH = [
    Game.PHASE_PREPARE,
    Game.PHASE_DAY_DISCUSSION,
    ...Game.NIGHT_PHASES,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_SUBTOTAL,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_TOTAL
  ]

  static ADD_NEXT_DAY = [
    ...Game.NIGHT_PHASES,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_SUBTOTAL,
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_TOTAL
  ]

  static ADD_NEXT_VOTE = [
    Game.PHASE_DAY_DISCUSSION,
    Game.PHASE_DAY_TOTAL
  ]


  //vote types in options
  static VOTE_TYPE_CLASSIC = "VOTE_TYPE_CLASSIC"
  static VOTE_TYPE_FAIR = "VOTE_TYPE_FAIR"
  static VOTE_TYPE_REALTIME = "VOTE_TYPE_REALTIME"

  //(CIVIL_WIN, MAFIA_WIN)
  end

  //[Onside,Onside,...]
  players

  phasePath
  phaseIndex
  possibleNightPhases
  numDay

  //[CARD_MAFIA,CARD_CIVIL, null, ...]
  cards

  //player to (player,false,null) - votes for court
  tableVotes
  //[id,id,id,...]  - path of players for court
  pathIdVote
  //id Player
  subtotalChoice
  lastDocVote

  log

  options

  constructor(room) {
    const players = room.getPlayers()

    this.log = room.getLog()
    this.options = room.getOptions()

    this.end = null
    this.players = []
    this._initPhase()
    this._initDay()
    this._createCards(players.length,this.options)

    this._initTable()
    this.pathIdVote = []
    this.subtotalChoice = null
    this.lastDocVote = null
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

    //if now phase == prepare or last night phase then next day
    if(this.getPhase() === Game.PHASE_PREPARE || this.isLastNightPhase()){
      this._nextDay()
      this._killInjured()
      // this._initAllProperties()
    }


    this.phaseIndex++
    while(!this._possiblePhase())
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
  _possiblePhase(){
    return !this.isNightPhase() || this.possibleNightPhases.includes(this.getPhase())
  }
  _initPhase(){
    this.phasePath = [...Game.START_PATH]
    this.phaseIndex = 0
    this.possibleNightPhases = [Game.PHASE_NIGHT_MAFIA]
  }
  isNightPhase(){
    return Game.NIGHT_PHASES.includes(this.getPhase())
  }
  isLastNightPhase(){
    return this.getPhase() === this.possibleNightPhases[this.possibleNightPhases.length-1]
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
  //DEP NIGHT PHASES 3
  _createCards(numPlayers, options){
    let numMaf = options.numMaf
    let numDoc = options.numDoc
    let numDet = options.numDet

    if(options.autoRole){
      //recommend -> 0
      let balance = numPlayers

      numMaf = 1
      numDoc = 0
      numDet = 0

      //cards with mafia
      while(numPossibleVotes(numPlayers,numMaf)>2){
        numMaf++
      }

      balance -= 5 * numMaf

      //cards with doctor
      if(balance < 0)
        numDoc += 1

      //cards with detective
      if(balance < -2)
        numDet += 1
    }



    //create cards
    let specInds = getSomeRandomInt(numPlayers,numMaf+numDet+numDoc)

    const detIndsInSpecInds = getSomeRandomInt(specInds.length, numDet)
    const detInds = detIndsInSpecInds.map(ind=>specInds[ind-1])
    specInds = specInds.filter(ind=>!detInds.includes(ind))

    const docIndsInSpecInds = getSomeRandomInt(specInds.length, numDoc)
    const docInds = docIndsInSpecInds.map(ind=>specInds[ind-1])
    specInds = specInds.filter(ind=>!docInds.includes(ind))

    const cards = []
    for(let i = 1; i<numPlayers+1; i++){
      if(detInds.includes(i))
        cards.push(Onside.CARD_DETECTIVE)
      else if(docInds.includes(i))
        cards.push(Onside.CARD_DOCTOR)
      else if(specInds.includes(i))
        cards.push(Onside.CARD_MAFIA)
      else
        cards.push(Onside.CARD_CIVIL)
    }

    this.cards = cards

    //ORDER MATTERS
    if(numDet !== 0)
      this.possibleNightPhases.push(Game.PHASE_NIGHT_DETECTIVE)
    if(numDoc !== 0)
      this.possibleNightPhases.push(Game.PHASE_NIGHT_DOCTOR)
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
  getRoleToMatchNightPhase(){
    //DEP NIGHT PHASES 3
    let role = Onside.CARD_MAFIA
    this._runFunctionsByPhase([
      ()=>{role = Onside.CARD_MAFIA},
      ()=>{role = Onside.CARD_DETECTIVE},
      ()=>{role = Onside.CARD_DOCTOR},
    ])
    return role
  }

  getPlayerByID(id){
    Checker.check_getPlayersByID(this,id)

    return this.players.find(player=>player.getID() === id)
  }
  getPlayerSpeaker(){
    return this.getPlayers().find(player=>player.isSpeak())
  }
  getPlayers(){
    return this.players
  }
  getPlayersAlive(){
    return this.players.filter(player=>player.isLive())
  }
  getPlayersInjured(){
    return this.getPlayersAlive().filter(player=>player.isInjured())
  }
  getPlayersDetected(){
    return this.getPlayersAlive().filter(player=>player.isDetected())
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
  getPlayersByRole(role){
    return this.getPlayers().filter(player=>player.getRole() === role)
  }

  _killPlayer(victim){
    //TODO: mb add validate

    victim.kill()
    const l = this.log
    l.setLog(l.constructor.WHO_LOG, l.getLogPhraseByDeadPlayer(victim))

    if(this._isMafiaWin())        this.end = Game.MAFIA_WIN
    else if(this._isCivilWin())   this.end = Game.CIVIL_WIN
  }
  _killInjured(){
    this.getPlayersInjured().forEach(player=>{
      if(player.isLive())
        this._killPlayer(player)
    })
  }
  _injurePlayer(player){
    player.toInjure()
  }
  _detectPlayer(player){
    player.toDetect()
  }
  _healPlayer(player){
    player.heal()
  }
  _initAllProperties(){
    this.getPlayers().forEach(player=>{
      player.miss()
      player.heal()
    })
  }

  addReadyPlayer(player){
    Checker.check_addReadyPlayer(this,player)

    player.ready()

    if(this.allPlayersReady()){
      this._nextPhase()
      this._initReadiness()
    }

  }
  allPlayersReady(){
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

    if(this.allPlayersVoteNight())
      this._actionOnVotesNight()

  }
  allPlayersVoteNight(){
    //who vote
    let role = this.getRoleToMatchNightPhase()

    const whoVoted      = this.getPlayersVotedNight()
    const whoShouldVote = this.getPlayersAlive().filter(player=>player.getRole() === role)
    const votes         = whoVoted.map(player=>player.getVoteNight())
    return  ((whoVoted.length === whoShouldVote.length)
      && votes.every(vote=>vote===votes[0]))
  }
  _actionOnVotesNight(){
    const choice = this.choiceVotesNight()

    //DEP NIGHT PHASES 3
    this._runFunctionsByPhase([
      ()=>{this._injurePlayer(choice)},
      ()=>{
        if(this.havePlayersOnNightPhase())
          this._detectPlayer(choice)
      },
      ()=>{
        if(this.havePlayersOnNightPhase()){
          this._healPlayer(choice)
          this.lastDocVote = choice.getID()
        }
      },
    ])

    this._initVotesNight()
    this._nextPhase()
  }
  choiceVotesNight(){
    if(this.allPlayersVoteNight()){
      const voter = this.getPlayersVotedNight()[0]
      return voter ? voter.getVoteNight() : null
    }

    return null
  }
  havePlayersOnNightPhase(){
    if(!Game.NIGHT_PHASES.includes(this.getPhase()))
      return null

    let role = this.getRoleToMatchNightPhase()

    return !!this.getPlayersByRole(role).filter(player=>player.isLive()).length
  }
  allAlreadyDetected(){
    const numDetected = this
      .getPlayersDetected()
      .length
    const numAliveDetective = this
      .getPlayersByRole(Onside.CARD_DETECTIVE)
      .filter(player=>player.isLive())
      .length
    const numAlive = this
      .getPlayersAlive()
      .length

    return numDetected === (numAlive - numAliveDetective)
  }
  _initVotesNight(){
    this.getPlayers()
      .filter(player=>player.getRole()!==Onside.CARD_CIVIL)
      .forEach(player=>player.setVoteNight(null))
  }


  _startSubTotal(){
    //TODO: TypeChecker
    if(this.getPhase() !== Game.PHASE_DAY_SUBTOTAL) return

    this.subtotalChoice = null
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
  }

  setVote(player,val){
    Checker.check_setVote(this,player,val)

    player.setVote(val)
    this.tableVotes.set(player,val)
    this._nextSpeaker()

    //TODO: check pathID
    if(this.isEndVote()){
      const isSubTotal = (this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      this._createPathIdFromTable(isSubTotal)
      this._actionOnVotes()
    }

  }
  _allPlayersVote(){
    const whoVoted      = this.getPlayersVoted()
    const whoShouldVote = this.getPlayersAlive()
    return  whoVoted.length === whoShouldVote.length
  }
  _enoughVote(){
    const whoVoted      = this.getPlayersVoted()
    const whoShouldVote = this.getPlayersAlive()

    if(this.getVoteType() !== Game.VOTE_TYPE_REALTIME
      && whoVoted.length === whoShouldVote.length)
      return true

    const sortEntry     = this.getSortVotesByScore()
    const len = sortEntry.length
    const max1 = sortEntry[len-1][1]
    const max2 = sortEntry[len-2][1]
    const numWhoUnVoted = whoShouldVote.length - whoVoted.length

    return this.getVoteType() === Game.VOTE_TYPE_REALTIME
      ? max1>whoShouldVote.length/2
      : max1>max2+numWhoUnVoted
  }
  isEndVote(){
    if(this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      return this._allPlayersVote()
    else if(this.getPhase() === Game.PHASE_DAY_TOTAL)
      return this._enoughVote()
  }
  _actionOnVotes(){
    //todo: clear table votes

    //decision is made
    let choice = this.choiceVotes()
    if(choice){
      this._killPlayer(choice)
      this._initTable()
    }

    //clear
    this.players.forEach(player=>{
      player.speakOff()
    })

    this._initVotes()
    this._nextPhase()
  }
  choiceVotes(){
    if((this.pathIdVote.length === 1) && (this.getPhase() === Game.PHASE_DAY_TOTAL)){
      const suspectID = this.pathIdVote[0]
      return this.getPlayerByID(suspectID)
    }

    return null
  }
  getSubtotalChoice(){
    return this.subtotalChoice
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
    const map = {}

    let count=0
    for(let phase of Game.NIGHT_PHASES){
      map[phase] = functions[count++]
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
    if(this.allPlayersReady()){
      this._nextPhase()
      this._initReadiness()
    }
  }
  setVoteNightWithoutNextPhase(player,val){
    Checker.check_setVoteNight(this,player,val)

    player.setVoteNight(val)
  } //*
  nextPhaseByNightVote(){
    if(this.allPlayersVoteNight())
      this._actionOnVotesNight()
    else{
      //TODO: auto vote
      const role = this.getRoleToMatchNightPhase()
      const voters = this.getPlayersByRole(role).filter(player=>player.isLive())
      const vote = this.getPlayersAlive().find(player=>player.getRole() !== role)
      voters.forEach(voter=>voter.setVoteNight(vote))
      this._actionOnVotesNight()
      // throw new Error("nextPhaseByNightVote: players not voted")
    }

  }
  setVoteWithoutNextPhase(player,val){
    Checker.check_setVote(this,player,val)

    player.setVote(val)
    this.tableVotes.set(player,val)
    this._nextSpeaker()

    //TODO: mb replace in nextPhaseByVote()
    if(this.isEndVote()){
      const isSubTotal = (this.getPhase() === Game.PHASE_DAY_SUBTOTAL)
      this._createPathIdFromTable(isSubTotal)
      if(isSubTotal)
        this.subtotalChoice = this.pathIdVote[this.pathIdVote.length-1]
    }

  } //*
  nextPhaseByVote(){
    if(this.isEndVote())
      this._actionOnVotes()
  }


  //options
  getVoteType(){
    return this.options.voteType
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












