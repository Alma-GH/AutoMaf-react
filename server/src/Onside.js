import Player from "./Player.js";

class Onside extends Player{

  //roles
  static CARD_CIVIL = "CARD_CIVIL"
  static CARD_MAFIA = "CARD_MAFIA"

  //special roles
  static SPEC_ROLES = [Onside.CARD_MAFIA]

  //(CARD_MAFIA,CARD_CIVIL) - card
  role

  alive
  readiness

  //(player,false,null) - votes for court
  vote

  //(player,null) - votes for special role (mafia, doctor, commissar)
  voteNight

  constructor(player,role) {
    super(player.getName());
    this.setID(player.getID())

    this.setRole(role)
    this.alive = true
    this.readiness = false
    this.setVote(null)
  }

  getRole(){
    return this.role
  }
  setRole(role){
    if(![Onside.CARD_CIVIL,Onside.CARD_MAFIA].includes(role))
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
    const isSpecRole  = Onside.SPEC_ROLES.includes(this.role)

    if((valIsPlayer || valIsNull) && isSpecRole)
      this.voteNight = vote
    else
      throw new Error("Type error: voteNight in Onside")
  }

}

export default Onside