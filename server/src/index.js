import Player from "./Player.js";
import Room from "./Room.js";
import Server from "./Server.js";

function log(name, arr){
  console.group(name)
  arr.forEach(el=>console.log(el.toString()))
  console.log(Server)
  console.groupEnd()
}

//Game process

//1)Create room

//GET DATA FROM CLIENT
const dataCR = {
  event: "create_room",

  nameCreator: "Roman",

  nameRoom: "For my friends",
  existPassword: false,
  password: "",
  numPlayers: 4,

  gameOptions:{}
}

//EVENT ON SERVER
try{
  const leader = new Player(dataCR.nameCreator)
  const newRoom = new Room(
    leader,
    dataCR.numPlayers,
    dataCR.nameRoom,
    dataCR.existPassword ? dataCR.password : null
  )
  Server.addRoom(newRoom)

  // log("CREATE ROOM:", [leader,newRoom])
}catch (e){
  console.log(e)
}


//TODO:POST DATA TO CLIENT



//2)Find room


//GET DATA FROM CLIENT
const dataFR = {
  event: "find_room",

  nameFinder: "Artur",
  nameRoom: "For my friends",
  passRoom: ""
}

//EVENT ON SERVER
try{
  const finder        = new Player(dataFR.nameFinder)
  const needRoom      = Server.getRoomByName(dataFR.nameRoom)
  const isConnectable = needRoom.getPass() ? needRoom.getPass() === dataFR.passRoom : true

  if(isConnectable){
    needRoom.addPlayer(finder)
  }

  // log("FIND ROOM:", [finder,needRoom])
}catch (e){
  console.log(e)
}

//TODO:POST DATA TO CLIENT


//3)Start game


//GET DATA FROM CLIENT
const dataSG = {
  event: "start_game",

  roomID: 0
}
//EVENT ON SERVER
try{
  const roomInGame = Server.getRoomByID(dataSG.roomID)

  //find room ->
  const player3 = new Player("Darya")
  const player4 = new Player("Nikita")
  roomInGame.addPlayer(player3); roomInGame.addPlayer(player4)

  roomInGame.startGame()

  // log("START_GAME:",[roomInGame,roomInGame.getGame()])
}catch (e){
  console.log(e)
}
//TODO:POST DATA TO CLIENT


//4)In game(prep readiness)


//GET DATA FROM CLIENT
const dataIG = {
  event: "choose_card",

  roomID: 0,

  idPlayer: 3,
  cardIndex: 2,
}

//EVENT ON SERVER
try{
  const needRoom = Server.getRoomByID(dataIG.roomID)
  const gameInRoom = needRoom.getGame()

  const player = needRoom.getPlayerByID(dataIG.idPlayer)

  gameInRoom.addMapping(player,dataIG.cardIndex)
  gameInRoom.addReadyPlayer(player)


  // log("IN GAME(CHOOSE CARD):", [needRoom,player,gameInRoom])
}catch (e){
  console.log(e)
}

//TODO:POST DATA TO CLIENT



//5)In game(readiness)


//GET DATA FROM CLIENT
const dataIG2 = {
  event: "readiness",

  roomID: 0,

  idPlayer: 1,
}

//EVENT ON SERVER
try{
  const needRoom = Server.getRoomByID(dataIG2.roomID)
  const gameInRoom = needRoom.getGame()

  //prep readiness ->
  const player1 = needRoom.getPlayerByID(0)
  const player2 = needRoom.getPlayerByID(1)
  const player3 = needRoom.getPlayerByID(2)
  gameInRoom.addMapping(player1,0)
  gameInRoom.addReadyPlayer(player1)
  gameInRoom.addMapping(player2,1)
  gameInRoom.addReadyPlayer(player2)
  gameInRoom.addMapping(player3,3)
  gameInRoom.addReadyPlayer(player3)

  const player = needRoom.getPlayerByID(dataIG2.idPlayer)
  gameInRoom.addReadyPlayer(player)

  // log("IN GAME(READINESS):", [needRoom,player,gameInRoom])

}catch (e){
  console.log(e)
}



//TODO:POST DATA TO CLIENT



//6)In game(vote for kill)


//GET DATA FROM CLIENT
const dataIG3 = {
  event: "vote_night",

  roomID: 0,

  idVoter: 1,
  idChosen: 2,
}
//EVENT ON SERVER
try{
  const needRoom = Server.getRoomByID(dataIG3.roomID)
  const gameInRoom = needRoom.getGame()

  // readiness ->
  const player1 = needRoom.getPlayerByID(0)
  const player2 = needRoom.getPlayerByID(2)
  const player3 = needRoom.getPlayerByID(3)
  gameInRoom.addReadyPlayer(player1)
  gameInRoom.addReadyPlayer(player2)
  gameInRoom.addReadyPlayer(player3)

  const mafia = needRoom.getPlayerByID(dataIG3.idVoter)
  const player = needRoom.getPlayerByID(dataIG3.idChosen)
  gameInRoom.setVoteNight(mafia,player)

  log("IN GAME(VOTE FOR KILL):", [mafia, player,needRoom,gameInRoom])

}catch (e){
  console.log(e)
}

//TODO:POST DATA TO CLIENT

