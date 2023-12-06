import {PROD} from "../const";

class MessageCreator{

  E_SETTINGS     = "change_settings"
  E_CREATE_ROOM  = "create_room"
  E_FIND_ROOM    = "find_room"
  E_START_GAME   = "start_game"
  E_STOP_GAME    = "stop_game"
  E_CHOOSE_CARD  = "choose_card"
  E_READINESS    = "readiness"
  E_VOTE_NIGHT   = "vote_night"
  E_VOTE         = "vote"
  E_NEXT_JUDGED  = "next_judged"
  E_QUIT         = "quit_player"

  E_ERROR        = "error"
  E_PLAYER_DATA  = "get_player"
  E_TIMER        = "get_timer"

  E_RECONNECT    = "reconnect"

  setSettings(roomID, voteType, autoRole, numMaf, numDet, numDoc){
    return {
      event: this.E_SETTINGS,
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
      event: this.E_START_GAME,
      roomID
    }
  }
  stopGame(roomID){
    return {
      event: this.E_STOP_GAME,
      roomID
    }
  }
  createRoom(creator, room, players, setPass,pass, options={}){
    return {
      event: this.E_CREATE_ROOM,

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
      event: this.E_FIND_ROOM,

      nameFinder: finder,
      nameRoom: room,
      passRoom: pass
    }
  }
  chooseCard(roomID, playerID, index){
    return {
      event: this.E_CHOOSE_CARD,

      roomID,

      idPlayer: playerID,
      cardIndex: index,
    }
  }
  readiness(roomID, playerID){
    return {
      event: this.E_READINESS,

      roomID: roomID,
      idPlayer: playerID,
    }
  }
  voteNight(roomID, playerID, voteID){
    return {
      event: this.E_VOTE_NIGHT,

      roomID,

      idVoter: playerID,
      idChosen: voteID,
    }
  }
  vote(roomID, playerID, voteID){
    return {
      event: this.E_VOTE,

      roomID,

      idVoter: playerID,
      idChosen: voteID,
    }
  }
  quit(roomID, playerID){
    return {
      event: this.E_QUIT,
      roomID,
      idPlayer: playerID
    }
  }

  reconnect(roomID, playerID){
    return {
      event: this.E_RECONNECT,
      roomID,
      idPlayer: playerID
    }
  }


  //TODO: add sendMsg

}

export default new MessageCreator()