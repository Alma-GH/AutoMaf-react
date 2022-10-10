const {
  E_CHOOSE_CARD,
  E_CREATE_ROOM, E_ERROR,
  E_FIND_ROOM,
  E_PLAYER_DATA, E_QUIT,
  E_READINESS,
  E_START_GAME,
  E_TIMER, E_VOTE, E_VOTE_NIGHT, EM_UNEXPECTED_QUIT
} = require("./utils/const.js");
const WSSEvent = require("./websocket/serverEvents.js");
const WSTimer = require("./websocket/timers.js");
const {broadcast, broadcastClear, single} = require("./websocket/send.js");
const {PORT, server, wss} = require("./websocket/websocket.js");



wss.on('connection', function connection(ws) {

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
          single(ws,{event:E_TIMER, time:0}, room.roomID)
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
          single(ws,{event:E_TIMER, time:0}, room.roomID)
          break;
        case E_START_GAME:
          room = WSSEvent.start_game(message)
          WSTimer.startTimerToGame(5,750,room)
          break;
        case E_CHOOSE_CARD:
          room = WSSEvent.choose_card(message)
          broadcastClear({event:E_CHOOSE_CARD, room}, room.roomID)
          break;
        case E_READINESS:
          room = WSSEvent.readiness(message)
          broadcastClear({event:E_READINESS, room}, room.roomID)

          if(room.getGame()._allPlayersReady())
            WSTimer.startTimerToNextPhaseOnReadiness(room,3,1000)

          break;
        case E_VOTE_NIGHT:
          room = WSSEvent.vote_night(message)
          broadcastClear({event:E_VOTE_NIGHT, room}, room.roomID)

          if(room.getGame()._allPlayersVoteNight())
            WSTimer.startTimerToNextPhaseOnVoteNight(room,3,1000)
          break;
        case E_VOTE:
          room = WSSEvent.vote(message)
          broadcastClear({event:E_VOTE, room}, room.roomID)

          if(room.getGame()._isEndVote())
            WSTimer.startTimerToNextPhaseOnVote(room,3,1000)
          break;
        case E_QUIT:
          ws.close();
          break;
      }

    }catch (e){
      console.log(e)
      single(ws,{event: E_ERROR,message: e.message})
    }
  })

  ws.on('close', function (){
    try {
      let room
      let error
      const data = {
        roomID:ws.id,
        idPlayer:ws.uid
      };
      [room, error] = WSSEvent.quit(data)
      if(room.game)
        broadcastClear({event:E_QUIT, room}, room.roomID)
      else
        broadcast({event:E_QUIT, room},room.roomID)

      broadcast({event:E_TIMER, time:0}, room.roomID)
      if(error)
        broadcast({event: E_ERROR,message: EM_UNEXPECTED_QUIT}, room.roomID)
    }catch (e){
      console.log(e)
    }
  })

})

server.listen(PORT, () => console.log("Server started on port: "+PORT))