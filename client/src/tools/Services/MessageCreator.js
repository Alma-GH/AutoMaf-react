
class MessageCreator{

  static E_CREATE_ROOM  = "create_room"
  static E_FIND_ROOM    = "find_room"
  static E_START_GAME   = "start_game"
  static E_CHOOSE_CARD  = "choose_card"
  static E_READINESS    = "readiness"
  static E_VOTE_NIGHT   = "vote_night"
  static E_VOTE         = "vote"
  // static E_NEXT_JUDGED  = "next_judged"
  static E_QUIT         = "quit_player"

  startGame(roomID){
    return {
      event: MessageCreator.E_START_GAME,
      roomID
    }
  }
  createRoom(creator, room, players, setPass,pass, options={}){
    return {
      event: MessageCreator.E_CREATE_ROOM,

      nameCreator: creator,

      nameRoom: room,
      existPassword: setPass,
      password: pass,
      numPlayers: players,

      gameOptions:options
    }
  }
  findRoom(finder, room, pass){
    return {
      event: MessageCreator.E_FIND_ROOM,

      nameFinder: finder,
      nameRoom: room,
      passRoom: pass
    }
  }
  chooseCard(roomID, playerID, index){
    return {
      event: MessageCreator.E_CHOOSE_CARD,

      roomID,

      idPlayer: playerID,
      cardIndex: index,
    }
  }
  readiness(roomID, playerID){
    return {
      event: MessageCreator.E_READINESS,

      roomID: roomID,
      idPlayer: playerID,
    }
  }
  voteNight(roomID, playerID, voteID){
    return {
      event: MessageCreator.E_VOTE_NIGHT,

      roomID,

      idVoter: playerID,
      idChosen: voteID,
    }
  }
  vote(roomID, playerID, voteID){
    return {
      event: MessageCreator.E_VOTE,

      roomID,

      idVoter: playerID,
      idChosen: voteID,
    }
  }
  quit(roomID, playerID){
    return {
      event: MessageCreator.E_QUIT,
      roomID,
      idPlayer: playerID
    }
  }
  // nextJudged(){}

}

export default new MessageCreator()