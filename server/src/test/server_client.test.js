import Player from "../class/Player.js";
import Room from "../class/Room.js";
import Server from "../class/Server.js";
import {skip_discussion} from "../utils/classU.js";

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

  gameInRoom.addReadyPlayer(gameInRoom.createRole(player,dataIG.cardIndex))


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
  gameInRoom.addReadyPlayer(gameInRoom.createRole(player1,0))
  gameInRoom.addReadyPlayer(gameInRoom.createRole(player2,1))
  gameInRoom.addReadyPlayer(gameInRoom.createRole(player3,3))

  const player = gameInRoom.getPlayerByID(dataIG2.idPlayer)
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
  const player1 = gameInRoom.getPlayerByID(0)
  const player2 = gameInRoom.getPlayerByID(2)
  const player3 = gameInRoom.getPlayerByID(3)
  gameInRoom.addReadyPlayer(player1)
  gameInRoom.addReadyPlayer(player2)
  gameInRoom.addReadyPlayer(player3)

  const mafia = gameInRoom.getPlayerByID(dataIG3.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG3.idChosen)
  gameInRoom.setVoteNight(mafia,player)

  // log("IN GAME(VOTE FOR KILL):", [mafia, player,needRoom,gameInRoom])

}catch (e){
  console.log(e)
}

//TODO:POST DATA TO CLIENT


//7)In game(vote)

//GET DATA FROM CLIENT
const dataIG4 = {
  event: "vote",

  roomID: 0,

  idVoter: 3,
  idChosen: 1,
}
//EVENT ON SERVER
try{
  const needRoom = Server.getRoomByID(dataIG4.roomID)
  const gameInRoom = needRoom.getGame()

  // readiness ->
  skip_discussion(gameInRoom)

  const voter = gameInRoom.getPlayerByID(dataIG4.idVoter)
  const player = gameInRoom.getPlayerByID(dataIG4.idChosen)
  gameInRoom.setVote(voter,player)

  // log("IN GAME(VOTE):", [voter, player,needRoom,gameInRoom])

}catch (e){
  console.log(e)
}
//TODO:POST DATA TO CLIENT


//7)In game(next judged)

//GET DATA FROM CLIENT
const dataIG5 = {
  event: "next_judged",

  roomID: 0,
}
//EVENT ON SERVER
try{
  const needRoom = Server.getRoomByID(dataIG5.roomID)
  const gameInRoom = needRoom.getGame()

  // vote ->
  const voter1 = gameInRoom.getPlayerByID(0)
  const voter2 = gameInRoom.getPlayerByID(1)
  const val1 = gameInRoom.getPlayerByID(1)
  const val2 = false
  gameInRoom.setVote(voter1,val1)
  gameInRoom.setVote(voter2,val2)

  // readiness ->
  skip_discussion(gameInRoom)

  gameInRoom.nextJudged()

  log("IN GAME(NEXT JUDGED):", [gameInRoom])

}catch (e){
  console.log(e)
}
//TODO:POST DATA TO CLIENT