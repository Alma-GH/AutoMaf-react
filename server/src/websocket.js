import {WebSocketServer} from "ws";
import Player from "./class/Player.js";
import Room from "./class/Room.js";
import Server from "./class/Server.js";
import {
  E_CHOOSE_CARD,
  E_CREATE_ROOM,
  E_FIND_ROOM, E_NEXT_JUDGED, E_QUIT,
  E_READINESS,
  E_START_GAME,
  E_VOTE,
  E_VOTE_NIGHT
} from "./utils/const.js";
import Onside from "./class/Onside.js";
import Game from "./class/Game.js";


const wss = new WebSocketServer({
  port:5000,
}, ()=>console.log("Server started on port 5000"))

wss.on('connection', function connection(ws) {
  console.log("Подключение к wss установлено")

  ws.on('message', function (message) {
    try{
      //TODO: check event
      //TODO: add reconnect
      message = JSON.parse(message)

      let room
      let player
      switch (message.event) {
        case E_CREATE_ROOM:
          [room,player] = create_room(message)
          ws.id = room.roomID
          single(ws, {event:E_CREATE_ROOM, player})
          single(ws, room)
          break;
        case E_FIND_ROOM:
          [room,player] = find_room(message)
          ws.id = room.roomID
          single(ws, {event:E_FIND_ROOM, player})
          if(room.game)
            broadcastClear(room, room.roomID)
          else
            broadcast(room,room.roomID)
          break;
        case E_START_GAME:
          room = start_game(message)
          broadcastClear(room, room.roomID)
          break;
        case E_CHOOSE_CARD:
          room = choose_card(message)
          broadcastClear(room, room.roomID)
          break;
        case E_READINESS:
          room = readiness(message)
          broadcastClear(room, room.roomID)

          if(room.game?.getPhase() === Game.PHASE_DAY_TOTAL)
            startTimer(ws,room)
          break;
        case E_VOTE_NIGHT:
          room = vote_night(message)
          broadcastClear(room, room.roomID)
          break;
        case E_VOTE:
          room = vote(message)
          broadcastClear(room, room.roomID)
          break;
        case E_QUIT:
          room = quit(message)
          delete ws.id
          if(room.game)
            broadcastClear(room, room.roomID)
          else
            broadcast(room,room.roomID)
          break;

        //no need
        case E_NEXT_JUDGED:
          room = nextJudged(message)
          broadcastClear(room, room.roomID)
          break;
      }
    }catch (e){
      console.log(e.message)
      single(ws,{event: "error",message: e.message})
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
  const game = room.getGame()

  //tmp and clear
  const checker = game.Checker
  game.Checker = undefined
  //TODO: crutch - after make voting by id
  const votes = game.players.map(player=>player.vote)
  game.players.forEach(player=>{
    if(player.vote instanceof Onside)
      player.vote = player.vote._id
  })

  broadcast(room,id)

  //return values
  game.Checker = checker
  game.players.forEach((player,ind)=> {
    player.vote = votes[ind]
  })
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


function quit(data){
  const dataIG6 = data

  const needRoom = Server.getRoomByID(dataIG6.roomID)

  const player = needRoom.getPlayerByID(dataIG6.idPlayer)
  needRoom.quitPlayer(player)

  return needRoom
}


//no need
function nextJudged(data){
  const dataIG5 = data

  const needRoom = Server.getRoomByID(dataIG5.roomID)
  const gameInRoom = needRoom.getGame()

  gameInRoom.nextJudged()

  return needRoom
}



function startTimer(client, room){
  const time = 10000
  const game = room.game
  const tm = setInterval(()=>{
    game.nextJudged()
    console.log({players: game.players})
    broadcastClear(room, room.roomID)
    if(!game.getPlayers().some(player=>player.isJudged()))
      clearInterval(tm)
  },time)
}


