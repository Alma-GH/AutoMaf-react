import Player from "./Player.js";
import Room from "./Room.js";
import Server from "./Server.js";


const player1 = new Player("Roman")
const player2 = new Player("Artur")
const player3 = new Player("Nikita")
const player4 = new Player("Darya")

const players = [
  player1,
  player2,
  player3,
  player4,
]

console.log(players.map(player=>player.toString()))

const room1 = new Room(player1)

players.forEach((player,ind)=>{
  if(ind!==0)
    room1.addPlayer(player)
})

console.log(room1.toString())

Server.addRoom(room1)

console.log(Server)


