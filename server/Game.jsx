

class Game {

  static PHASE_PREPARE        = "PHASE_PREPARE"
  static PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
  static PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
  static PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
  static PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

  phase
  numDay
  cards
  votes

  constructor() {
    this.phase = Game.PHASE_PREPARE
    this.numDay = 0
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
    this.numDay = this.numDay + 1
  }
  initDay(){
    this.numDay = 0
  }



}