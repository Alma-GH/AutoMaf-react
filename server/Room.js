import Player from "./Player.js";


class Room {

  static newID = 0
  roomID

  players
  newPlayerID


  constructor(leader) {
    //init
    this.roomID = Room.newID++
    this.players = []
    this.newPlayerID = 0

    this.addPlayer(leader)
  }

  addPlayer(player){
    //TODO: change check type

    //check type
    if(!(player instanceof Player))
      throw new Error("Type error: Room.addPlayer(player)")


    player.setID(this.newPlayerID++)
    this.players.push(player)
  }

  toString(){
    return JSON.stringify({
      s_newID: Room.newID,

      roomID: this.roomID,
      players: this.players.map(player=>player.toString()),
      newPlayerID: this.newPlayerID
    },null,2)
  }
}

export default Room