const Player = require("./Player.js");

class Onside extends Player{

  //roles
  static CARD_CIVIL = "CARD_CIVIL"
  static CARD_MAFIA = "CARD_MAFIA"

  static CARD_DETECTIVE = "CARD_DETECTIVE"
  static CARD_DOCTOR = "CARD_DOCTOR"
  static CARD_BUTTERFLY = "CARD_BUTTERFLY"


  //(CARD_MAFIA,CARD_CIVIL, ...) - card
  role

  alive
  readiness
  speak
  judged

  //temporary properties
  injure
  detected

  //(player,false,null) - votes for court
  vote

  //(player,null) - votes for special role (mafia, doctor, detective)
  voteNight

  constructor(player,role) {
    super(player.getName(), player.getID(), player.getAvatar());

    this.setRole(role)

    this.alive = true
    this.readiness = false
    this.speak = false
    this.judged = false

    this.injure = false
    this.detected = false

    this.setVote(null)
  }

  getRole(){
    return this.role
  }
  setRole(role){
    if(![
      Onside.CARD_CIVIL,
      Onside.CARD_MAFIA,
      Onside.CARD_DETECTIVE,
      Onside.CARD_DOCTOR,
      Onside.CARD_BUTTERFLY,
    ].includes(role))
      throw new Error("Type error: role in Onside")
    this.role = role
  }

  isLive(){
    return this.alive
  }
  kill(){
    this.alive = false
  }
  revive(){
    this.alive = true
  }

  isReady(){
    return this.readiness
  }
  ready(){
    this.readiness = true
  }
  unready(){
    this.readiness = false
  }

  isSpeak(){
    return this.speak
  }
  speakOn(){
    this.speak = true
  }
  speakOff(){
    this.speak = false
  }

  isJudged(){
    return this.judged
  }
  judgedOn(){
    this.judged = true
  }
  judgedOff(){
    this.judged = false
  }

  isInjured(){
    return this.injure
  }
  toInjure(){
    this.injure = true
  }
  heal(){
    this.injure = false
  }

  isDetected(){
    return this.detected
  }
  toDetect(){
    this.detected = true
  }
  miss(){
    this.detected = false
  }


  getVote(){
    return this.vote
  }
  setVote(vote){
    const valIsNull   = [false,null].includes(vote)
    const valIsPlayer = vote instanceof Onside

    if(valIsPlayer || valIsNull)
      this.vote = vote
    else
      throw new Error("Type error: vote in Onside")
  }

  getVoteNight(){
    return this.voteNight
  }
  setVoteNight(vote){
    const valIsNull   = (vote === null)
    const valIsPlayer = (vote instanceof Onside)
    const isSpecRole  = (this.role !== Onside.CARD_CIVIL)

    if((valIsPlayer || valIsNull) && isSpecRole)
      this.voteNight = vote
    else
      throw new Error("Type error: voteNight in Onside")
  }

}

module.exports = Onside