const {
  E_CHOOSE_CARD,
  E_CREATE_ROOM, E_ERROR,
  E_FIND_ROOM,
  E_PLAYER_DATA, E_QUIT,
  E_READINESS,
  E_START_GAME,
  E_TIMER, E_VOTE, E_VOTE_NIGHT, EM_UNEXPECTED_QUIT,

  T_START, TO_START,
  T_READY, TO_READY,
  T_VOTE_NIGHT, TO_VOTE_NIGHT,
  T_VOTE, TO_VOTE,
  T_ACCESS_VOTE_MIN, T_ACCESS_VOTE_MAX, TO_ACCESS_VOTE,
  TO_RECONNECT
} = require("./utils/const.js");
const WSSEvent = require("./websocket/serverEvents.js");
const WSTimer = require("./websocket/timers.js");
const {broadcast, broadcastClear, single} = require("./websocket/send.js");
const {PORT, server, wss} = require("./websocket/websocket.js");
const Room = require("./class/Room.js");
const {E_SETTINGS, E_STOP_GAME, EM_QUIT_ON_GAME, E_RECONNECT} = require("./utils/const");



wss.on('connection', function connection(ws) {

  function quit(){
    const data = {
      roomID:ws.id,
      idPlayer:ws.uid
    };
    const [room, errorTimer, errorQuit] = WSSEvent.quit(data)
    delete ws.id
    delete ws.uid

    broadcastClear({event:E_QUIT, room}, room.roomID)

    broadcast({event:E_TIMER, timer: {name:Room.TK_START, time:0}}, room.roomID)
    if(errorTimer)
      broadcast({event: E_ERROR,message: EM_UNEXPECTED_QUIT}, room.roomID)
    else if(errorQuit)
      broadcast({event: E_ERROR,message: EM_UNEXPECTED_QUIT}, room.roomID)
  }

  ws.on('message', function (message) {
    try{
      //TODO: check event
      //TODO: add reconnect
      message = JSON.parse(message)

      let room
      let player
      switch (message.event) {
        case E_CREATE_ROOM:
          [room,player] = WSSEvent.create_room(message)
          ws.id = room.roomID
          ws.uid = player.getID()
          single(ws, {event:E_CREATE_ROOM, room})
          single(ws, {event:E_PLAYER_DATA, player})
          single(ws,{event:E_TIMER, timer: {name:Room.TK_START, time:0}}, room.roomID)
          break;
        case E_FIND_ROOM:
          [room,player] = WSSEvent.find_room(message)
          ws.id = room.roomID
          ws.uid = player.getID()
          if(room.game)
            broadcastClear({event:E_FIND_ROOM, room}, room.roomID)
          else
            broadcast({event:E_FIND_ROOM, room},room.roomID)
          single(ws, {event:E_PLAYER_DATA, player})
          single(ws,{event:E_TIMER, timer: {name:Room.TK_START, time:0}}, room.roomID)
          break;
        case E_SETTINGS:
          room = WSSEvent.set_settings(message)
          broadcast({event:E_SETTINGS, room}, room.roomID)
          break;
        case E_START_GAME:
          room = WSSEvent.start_game(message)
          WSTimer.startTimerToGame(T_START,TO_START,room)
          break;
        case E_STOP_GAME:
          room = WSSEvent.stop_game(message)
          broadcast({event:E_STOP_GAME, room}, room.roomID)
          break;
        case E_CHOOSE_CARD:
          room = WSSEvent.choose_card(message)
          broadcastClear({event:E_CHOOSE_CARD, room}, room.roomID)
          break;
        case E_READINESS:
          room = WSSEvent.readiness(message)
          broadcastClear({event:E_READINESS, room}, room.roomID)

          if(room.getGame().allPlayersReady())
            WSTimer.startTimerToNextPhaseOnReadiness(room,T_READY,TO_READY)

          break;
        case E_VOTE_NIGHT:
          room = WSSEvent.vote_night(message)
          broadcastClear({event:E_VOTE_NIGHT, room}, room.roomID)

          if(room.getGame().allPlayersVoteNight())
            WSTimer.startTimerToNextPhaseOnVoteNight(room,T_VOTE_NIGHT,TO_VOTE_NIGHT)
          break;
        case E_VOTE:
          let vote
          [room, vote] = WSSEvent.vote(message)
          broadcastClear({event:E_VOTE, room}, room.roomID)
          const game = room.getGame()
          const enumGAME = game.constructor

          if(game.getVoteType() === enumGAME.VOTE_TYPE_REALTIME
            && game.getPhase() === enumGAME.PHASE_DAY_TOTAL){

            const time = vote?.getID() !== game.getSubtotalChoice()
              ? T_ACCESS_VOTE_MAX
              : T_ACCESS_VOTE_MIN
            WSTimer.controlTimerToAccessVote(room, time,TO_ACCESS_VOTE)

          }else{
            if(game.isEndVote())
              WSTimer.startTimerToNextPhaseOnVote(room,T_VOTE,TO_VOTE)
          }
          break;
        case E_QUIT:
          // ws.close();
          quit()
          break;

        case E_RECONNECT:
          //TODO: add wssevent reconnect
          [room,player] = WSSEvent.get_room(message)
          room.clearTimeout(Room.TK_RECONNECT+player.getID())
          ws.id = room.roomID
          ws.uid = player.getID()

          broadcastClear({event:E_RECONNECT, room}, room.roomID)

          single(ws, {event:E_PLAYER_DATA, player})
          break;

        default:
          console.group("UNKNOWN MESSAGE")
          console.log({message})
          console.groupEnd()
      }

    }catch (e){
      console.log(e)
      single(ws,{event: E_ERROR,message: e.message})
    }
  })

  ws.on('close', function (){
    try {
      const data = {
        roomID:ws.id,
        idPlayer:ws.uid
      };
      const [room,player] = WSSEvent.get_room(data)
      if(!room.getStatus())
        quit()
      else
        room.setTimeoutID(quit, TO_RECONNECT, Room.TK_RECONNECT+data.idPlayer)


    }catch (e){
      console.log(e)
    }
  })

})

server.listen(PORT, () => console.log("Server started on port: "+PORT))