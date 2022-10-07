import {
  E_CHOOSE_CARD,
  E_CREATE_ROOM, E_ERROR,
  E_FIND_ROOM,
  E_PLAYER_DATA, E_QUIT,
  E_READINESS,
  E_START_GAME,
  E_TIMER, E_VOTE, E_VOTE_NIGHT, EM_UNEXPECTED_QUIT
} from "./utils/const.js";
import {choose_card, create_room, find_room, quit,
  readiness, start_game, vote, vote_night} from "./utils/serverEvents.js";
import {
  startTimerToGame,
  startTimerToNextPhaseOnReadiness,
  startTimerToNextPhaseOnVote,
  startTimerToNextPhaseOnVoteNight
} from "./utils/timers.js";
import {broadcast, broadcastClear, single} from "./utils/send.js";
import {PORT, server, wss} from "./websocket.js";




wss.on('connection', function connection(ws) {

  ws.on('message', function (message) {
    try{
      //TODO: check event
      //TODO: add reconnect
      message = JSON.parse(message)

      let room
      let player
      let error
      switch (message.event) {
        case E_CREATE_ROOM:
          [room,player] = create_room(message)
          ws.id = room.roomID
          single(ws, {event:E_CREATE_ROOM, room})
          single(ws, {event:E_PLAYER_DATA, player})
          single(ws,{event:E_TIMER, time:0}, room.roomID)
          break;
        case E_FIND_ROOM:
          [room,player] = find_room(message)
          ws.id = room.roomID
          if(room.game)
            broadcastClear({event:E_FIND_ROOM, room}, room.roomID)
          else
            broadcast({event:E_FIND_ROOM, room},room.roomID)
          single(ws, {event:E_PLAYER_DATA, player})
          single(ws,{event:E_TIMER, time:0}, room.roomID)
          break;
        case E_START_GAME:
          room = start_game(message)
          startTimerToGame(5,750,room)
          break;
        case E_CHOOSE_CARD:
          room = choose_card(message)
          broadcastClear({event:E_CHOOSE_CARD, room}, room.roomID)
          break;
        case E_READINESS:
          room = readiness(message)
          broadcastClear({event:E_READINESS, room}, room.roomID)

          if(room.getGame()._allPlayersReady())
            startTimerToNextPhaseOnReadiness(room,3,1000)

          break;
        case E_VOTE_NIGHT:
          room = vote_night(message)
          broadcastClear({event:E_VOTE_NIGHT, room}, room.roomID)

          if(room.getGame()._allPlayersVoteNight())
            startTimerToNextPhaseOnVoteNight(room,3,1000)
          break;
        case E_VOTE:
          room = vote(message)
          broadcastClear({event:E_VOTE, room}, room.roomID)

          if(room.getGame()._isEndVote())
            startTimerToNextPhaseOnVote(room,3,1000)
          break;
        case E_QUIT:
          [room, error] = quit(message)
          delete ws.id
          if(room.game)
            broadcastClear({event:E_QUIT, room}, room.roomID)
          else
            broadcast({event:E_QUIT, room},room.roomID)

          broadcast({event:E_TIMER, time:0}, room.roomID)
          if(error)
            broadcast({event: E_ERROR,message: EM_UNEXPECTED_QUIT}, room.roomID)
          break;
      }
    }catch (e){
      console.log(e)
      single(ws,{event: E_ERROR,message: e.message})
    }
  })

})

server.listen(PORT, () => console.log("Server started on port: "+PORT))