import {WebSocketServer} from "ws";
import Player from "./class/Player.js";
import Room from "./class/Room.js";
import Server from "./class/Server.js";
import {
  E_CHOOSE_CARD,
  E_CREATE_ROOM,
  E_FIND_ROOM, E_NEXT_JUDGED,
  E_READINESS,
  E_START_GAME,
  E_VOTE,
  E_VOTE_NIGHT
} from "./utils/const.js";


const wss = new WebSocketServer({
  port:5000,
}, ()=>console.log("Server started on port 5000"))

wss.on('connection', function connection(ws) {
  // ws.id = Date.now()
  console.log("Подключение к wss установлено")

  ws.on('message', function (message) {
    try{
      //TODO: check event
      message = JSON.parse(message)

      let room
      let player
      switch (message.event) {
        case E_CREATE_ROOM:
          [room,player] = create_room(message)
          single(ws, {event:E_CREATE_ROOM, player})
          single(ws, room)
          break;
        case E_FIND_ROOM:
          [room,player] = find_room(message)
          single(ws, {event:E_FIND_ROOM, player})
          broadcast(room)
          break;
        case E_START_GAME:
          room = start_game(message)
          broadcastClear(room)
          break;
        case E_CHOOSE_CARD:
          room = choose_card(message)
          broadcastClear(room)
          break;
        case E_READINESS:
          room = readiness(message)
          broadcastClear(room)
          break;
        case E_VOTE_NIGHT:
          room = vote_night(message)
          broadcastClear(room)
          break;
        case E_VOTE:
          room = vote(message)
          broadcastClear(room)
          break;
        case E_NEXT_JUDGED:
          room = nextJudged(message)
          broadcastClear(room)
          break;
      }
    }catch (e){
      console.log(e.message)
      broadcast(e.message)
    }

  })
})


//send

function single(client, message){
  client.send(JSON.stringify(message))
}

function broadcast(message, id) {
  wss.clients.forEach(client => {
    if(id===undefined || client.id === id)
      client.send(JSON.stringify(message))
  })
}

function broadcastClear(room,id){
  let game = room.getGame()
  let checker = game.Checker
  game.Checker = undefined
  broadcast(room,id)
  game.Checker = checker
}


//server events

function create_room(data){
  const dataCR = data

  const leader = new Player(dataCR.nameCreator)
  const newRoom = new Room(
    leader,
    dataCR.numPlayers,
    dataCR.nameRoom,
    dataCR.existPassword ? dataCR.password : null
  )
  Server.addRoom(newRoom)


  return [newRoom,leader]
}

function find_room(data){
  const dataFR = data

  const finder        = new Player(dataFR.nameFinder)
  const needRoom      = Server.getRoomByName(dataFR.nameRoom)
  const isConnectable = needRoom.getPass() ? needRoom.getPass() === dataFR.passRoom : true

  if(isConnectable){
    needRoom.addPlayer(finder)
    return [needRoom,finder]
  }

}

function start_game(data){
  const dataSG = data

  const roomInGame = Server.getRoomByID(dataSG.roomID)
  roomInGame.startGame()

  return roomInGame
}

function choose_card(data){
  const dataIG = data

  const needRoom = Server.getRoomByID(dataIG.roomID)
  const gameInRoom = needRoom.getGame()

  const player = needRoom.getPlayerByID(dataIG.idPlayer)

  gameInRoom.createRole(player,dataIG.cardIndex)

  return needRoom
}

function readiness(data){
  const dataIG2 = data

  const needRoom = Server.getRoomByID(dataIG2.roomID)
  const gameInRoom = needRoom.getGame()

  const player = gameInRoom.getPlayerByID(dataIG2.idPlayer)
  gameInRoom.addReadyPlayer(player)

  return needRoom
}

function vote_night(data){
  const dataIG3 = data

  const needRoom = Server.getRoomByID(dataIG3.roomID)
  const gameInRoom = needRoom.getGame()

  const mafia = gameInRoom.getPlayerByID(dataIG3.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG3.idChosen)
  gameInRoom.setVoteNight(mafia,player)

  return needRoom
}

function vote(data){
  const dataIG4 = data

  const needRoom = Server.getRoomByID(dataIG4.roomID)
  const gameInRoom = needRoom.getGame()

  const voter = gameInRoom.getPlayerByID(dataIG4.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG4.idChosen)
  gameInRoom.setVote(voter,player)

  return needRoom
}

function nextJudged(data){
  const dataIG5 = data

  const needRoom = Server.getRoomByID(dataIG5.roomID)
  const gameInRoom = needRoom.getGame()

  gameInRoom.nextJudged()

  return needRoom
}

