
class MessageCreator{

  static E_SETTINGS     = "change_settings"
  static E_CREATE_ROOM  = "create_room"
  static E_FIND_ROOM    = "find_room"
  static E_START_GAME   = "start_game"
  static E_STOP_GAME    = "stop_game"
  static E_CHOOSE_CARD  = "choose_card"
  static E_READINESS    = "readiness"
  static E_VOTE_NIGHT   = "vote_night"
  static E_VOTE         = "vote"
  static E_NEXT_JUDGED  = "next_judged"
  static E_QUIT         = "quit_player"

  static E_ERROR        = "error"
  static E_PLAYER_DATA  = "get_player"
  static E_TIMER        = "get_timer"

  static E_RECONNECT    = "reconnect"

  setSettings(roomID, voteType, autoRole, numMaf, numDet, numDoc){
    return {
      event: MessageCreator.E_SETTINGS,
      roomID,
      voteType,
      autoRole,
      numMaf,
      numDet,
      numDoc
    }
  }
  startGame(roomID){
    return {
      event: MessageCreator.E_START_GAME,
      roomID
    }
  }
  stopGame(roomID){
    return {
      event: MessageCreator.E_STOP_GAME,
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

      gameOptions: {
        ...options,
        numMaf: +options.numMaf,
        numDet: +options.numDet,
        numDoc: +options.numDoc
      }
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

  reconnect(roomID, playerID){
    return {
      event: MessageCreator.E_RECONNECT,
      roomID,
      idPlayer: playerID
    }
  }


  //TODO: add sendMsg

}

export default new MessageCreator()