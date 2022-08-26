import Player from "../class/Player.js";
import Room from "../class/Room.js";
import Server from "../class/Server.js";
import Game from "../class/Game.js";


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

const room1 = new Room(player1,4,"fff")

players.forEach((player,ind)=>{
  if(ind!==0)
    room1.addPlayer(player)
})

console.log(room1.toString())

Server.addRoom(room1)

console.log(Server)
