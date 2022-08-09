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

  log("CREATE ROOM:", [leader,newRoom])
}catch (e){
  console.log(e.message)
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
  const needRoom      = Server.getRooms().find(room=>room.getName()===dataFR.nameRoom)
  const isConnectable = needRoom.getPass() ? needRoom.getPass() === dataFR.passRoom : true

  if(isConnectable){
    needRoom.addPlayer(finder)
  }

  log("FIND ROOM:", [finder,needRoom])
}catch (e){
  console.log(e.message)
}

//TODO:POST DATA TO CLIENT


//3)Start game


//GET DATA FROM CLIENT
//EVENT ON SERVER
//POST DATA TO CLIENT


//4)In game


//GET DATA FROM CLIENT
//EVENT ON SERVER
//POST DATA TO CLIENT

